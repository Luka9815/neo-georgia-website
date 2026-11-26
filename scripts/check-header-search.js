import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { getPathPrefix } from '../lib/urls.js';
import { loadContent } from '../lib/content.js';
import ka from '../src/_data/ka.json' with { type: 'json' };
import en from '../src/_data/en.json' with { type: 'json' };
import { serveFixtureSite } from './fixture-site.js';

const input = '#header-search-query';
const toggle = 'button.search-link';
const panel = '#header-search';
const option = '#header-search-list [role=option]';
const result = '.header-search-result';
const feedback = '.header-search-message:visible';
const copy = { ka, en };
const sample = { ka: 'ერაზმუს მუნდუსი', en: 'Erasmus Mundus' };
const actionSectors = Object.fromEntries(loadContent().action.map(item => [item.slug, item.sectors[0]]));
const awaitResults = page => page.locator(result).first().waitFor({ state: 'visible' });

async function checkMetadata(page, lang, prefix) {
  const items = await page.evaluate(async () => {
    const engine = await import(document.querySelector('#header-search').dataset.index);
    const { results } = await engine.search(null);
    return Promise.all(results.map(async result => {
      const { url, meta } = await result.data();
      return { url, type: meta.type, sector: meta.sector };
    }));
  });
  assert.ok(items.every(item => item.url.startsWith(`${prefix}${lang}/`)));
  assert.deepEqual([...new Set(items.map(item => item.type))].sort(), Object.keys(copy[lang].searchTypes).sort());
  for (const item of items.filter(item => item.type === 'action')) {
    assert.equal(item.sector, actionSectors[item.url.split('/').at(-2)]);
  }
  assert.equal(items.filter(item => item.type === 'action').length, Object.keys(actionSectors).length);
  return Object.groupBy(items, item => item.type);
}

async function checkNoJs(browser, base, prefix, lang) {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(`${base}${prefix}${lang}/`);
    assert.equal(await page.locator('a.search-link').getAttribute('href'), `${prefix}${lang}/search/`);
    assert.equal(await page.locator(panel).isVisible(), false);
    await page.locator('a.search-link').click();
    assert.ok(await page.locator('[data-search-fallback]').isVisible());
  } finally { await context.close(); }
}

async function checkStaleAndLabels(browser, base, prefix, lang) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.route(`**/pagefind/${lang}/pagefind.js`, route => route.fulfill({
      contentType: 'text/javascript',
      body: `
        export async function options() {}
        export async function search(query) {
          const url = query === 'old' ? '${prefix}${lang}/about/' : '${prefix}${lang}/resources/';
          const type = query.startsWith('label-') ? query.slice(6) : 'page';
          if (query === 'old') await new Promise(resolve => { window.releaseOld = resolve; });
          return { results: [{ id:query, async data() {
            if (query === 'old') window.oldDelivered = true;
            return { url, meta:{ title:query, type }, plain_excerpt:'<b>plain content</b>' };
          } }] };
        }
      `,
    }));
    await page.goto(`${base}${prefix}${lang}/`);
    await page.locator(toggle).click();
    for (const [type, label] of Object.entries(copy[lang].searchTypes)) {
      await page.locator(input).fill(`label-${type}`);
      await awaitResults(page);
      assert.equal(await page.locator(`${result} .chip`).textContent(), label);
    }
    await page.locator(input).fill('old');
    await page.waitForFunction(() => typeof window.releaseOld === 'function');
    await page.locator(input).fill('new');
    await awaitResults(page);
    assert.equal(await page.locator(`${result} .header-search-title`).textContent(), 'new');
    assert.equal(await page.locator(`${result} .header-search-excerpt`).textContent(), '<b>plain content</b>');
    assert.equal(await page.locator(`${result} .header-search-excerpt b`).count(), 0);
    await page.evaluate(() => window.releaseOld());
    await page.waitForFunction(() => window.oldDelivered);
    assert.equal(await page.locator(`${result} .header-search-title`).textContent(), 'new');
  } finally { await context.close(); }
}

async function checkEngineError(browser, base, prefix) {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.route('**/pagefind/en/pagefind.js', route => route.abort());
    await page.goto(`${base}${prefix}en/`);
    await page.locator(toggle).click();
    await page.locator(feedback).waitFor({ state: 'visible' });
    assert.equal(await page.locator(feedback).textContent(), en.headerSearchError);
    assert.equal(new URL(await page.locator('.header-search-all').getAttribute('href')).pathname, `${prefix}en/search/`);
  } finally { await context.close(); }
}

export async function checkHeaderSearch(browser, base, prefix) {
  const report = { prefix, cases: [], georgian: [] };
  for (const lang of ['ka', 'en']) {
    await checkNoJs(browser, base, prefix, lang);
    await checkStaleAndLabels(browser, base, prefix, lang);
    for (const width of [320, 390, 1024, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const requests = [];
      page.on('request', request => requests.push(request.url()));
      try {
        const home = `${base}${prefix}${lang}/`;
        await page.goto(home);
        await page.locator(toggle).waitFor();
        assert.ok(!requests.some(url => /\/pagefind\/|\/header-search-results\.js|\/georgian-search\.js/.test(url)));
        if (width < 1024) await page.locator('.mobile-menu summary').click();
        await page.keyboard.press('/');
        assert.equal(await page.locator(toggle).getAttribute('aria-expanded'), 'true');
        assert.equal(await page.locator(toggle).getAttribute('aria-controls'), panel.slice(1));
        assert.equal(await page.locator(':focus').getAttribute('id'), input.slice(1));
        assert.ok(await page.locator('.brand').isVisible());
        assert.ok(await page.locator('.language-switch').isVisible());
        assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
        assert.equal(await page.locator('.desktop-navigation').isVisible(), false);
        await page.waitForFunction(() => performance.getEntriesByType('resource').some(entry => entry.name.endsWith('/pagefind.js')));
        await page.locator(input).fill('K');
        assert.equal(await page.locator(option).count(), 0);
        await page.locator(input).fill(sample[lang]);
        await awaitResults(page);
        const rows = await page.locator(result).count();
        assert.ok(rows >= 1 && rows <= 6);
        assert.equal(await page.locator(option).count(), rows + 1);
        assert.equal(await page.locator(`${result} .chip[data-sector="higher-education"]`).first().textContent(), copy[lang].searchTypes.action);
        assert.ok(await page.locator(`${result} .header-search-title strong`).count());
        const all = new URL(await page.locator(option).last().getAttribute('href'));
        assert.equal(all.searchParams.get('q'), sample[lang]);
        assert.equal(all.pathname, `${prefix}${lang}/search/`);
        const action = page.locator(input);
        await action.press('ArrowDown');
        assert.equal(await action.getAttribute('aria-activedescendant'), 'header-search-option-0');
        await action.press('ArrowDown');
        assert.equal(await action.getAttribute('aria-activedescendant'), 'header-search-option-1');
        await action.press('ArrowUp');
        assert.equal(await action.getAttribute('aria-activedescendant'), 'header-search-option-0');
        await action.press('Home');
        assert.equal(await action.evaluate(element => element.selectionStart), 0);
        await action.press('End');
        assert.equal(await action.evaluate(element => element.selectionStart), sample[lang].length);
        assert.equal(await page.locator(option).first().getAttribute('aria-selected'), 'true');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const optionHeight = await page.locator(option).last().evaluate(el => el.getBoundingClientRect().height);
        assert.ok(optionHeight >= 44);
        const axe = await new AxeBuilder({ page }).options({ resultTypes: ['violations'] }).analyze();
        assert.deepEqual(axe.violations.map(issue => [issue.id, issue.nodes.map(node => node.target)]), []);
        if (width === 390) {
          await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
          assert.equal(await page.locator(panel).evaluate(el => getComputedStyle(el).animationName), 'none');
          assert.equal(await page.locator(option).first().evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
          const forced = await new AxeBuilder({ page }).options({ resultTypes: ['violations'] }).analyze();
          assert.deepEqual(forced.violations.map(issue => [issue.id, issue.nodes.map(node => node.target)]), []);
          await page.emulateMedia({ forcedColors: null, reducedMotion: null });
          const types = await checkMetadata(page, lang, prefix);
          assert.equal(Object.keys(types).length, 8);
          if (lang === 'ka') {
            for (const query of ['მობილობა', 'მობილობის', 'მობილობ', 'KA171', 'ერაზმუს KA171']) {
              await action.fill(query);
              await awaitResults(page);
              report.georgian.push({ query, urls: await page.locator(result).evaluateAll(links => links.map(link => new URL(link.href).pathname)) });
            }
          }
          await action.fill('zzqxxnoresult');
          await page.waitForFunction(() => document.querySelector('.header-search-message').textContent.includes('zzqxxnoresult'));
          assert.equal(await page.locator(result).count(), 0);
          assert.equal(await page.locator(option).count(), 1);
        }
        await action.press('Escape');
        assert.equal(await page.locator(panel).isVisible(), false);
        assert.ok(await page.locator(toggle).evaluate(el => el === document.activeElement));
        await page.locator(toggle).click();
        await page.locator('.preview-bar').click({ position: { x: 8, y: 8 } });
        assert.equal(await page.locator(panel).isVisible(), false);
        assert.ok(await page.locator(toggle).evaluate(el => el === document.activeElement));

        await page.evaluate(() => scrollTo(0, 2000));
        await page.waitForFunction(() => document.querySelector('.site-header').hasAttribute('data-compact'));
        await page.locator(toggle).click();
        await action.fill(sample[lang]);
        await awaitResults(page);
        await action.press('ArrowDown');
        const destination = await page.locator(option).first().evaluate(el => el.href);
        await action.press('Enter');
        await page.waitForURL(destination);
        assert.ok(requests.every(url => new URL(url).origin === new URL(base).origin));
        assert.ok(!requests.some(url => url.includes(`/pagefind/${lang === 'ka' ? 'en' : 'ka'}/`)));

        await page.goto(home);
        const aboutData = page.locator('.figures-data');
        assert.equal(await aboutData.getAttribute('open'), null);
        assert.equal(await aboutData.locator('[data-project-mobility-coverage]').isVisible(), false);
        if (width === 390 || width === 1280) {
          const [calls, events] = await page.locator('.compact-update a').evaluateAll(links => links.map(link => {
            const { top, height } = link.getBoundingClientRect();
            return { top, height };
          }));
          if (calls && events) {
            if (width === 1280) {
              assert.equal(calls.height, events.height);
              assert.equal(calls.top, events.top);
            } else assert.ok(events.top >= calls.top + calls.height);
          }
        }
        await aboutData.locator('summary').press('Enter');
        assert.equal(await aboutData.locator('[data-project-mobility-coverage]').textContent(), copy[lang].projectMobilityCoverage);
        await page.locator(toggle).click();
        await action.fill(sample[lang]);
        await action.press('Enter');
        await page.waitForURL(url => url.pathname === `${prefix}${lang}/search/` && url.searchParams.get('q') === sample[lang]);
        await page.locator('[data-search-list] a').first().waitFor();
        assert.equal(await page.locator('#search-query').inputValue(), sample[lang]);
        await page.locator(toggle).click();
        assert.equal(await page.locator(':focus').getAttribute('id'), 'search-query');
        await page.locator('#search-query').press('/');
        assert.equal(await page.locator(panel).isVisible(), false);
        report.cases.push({ lang, width, rows, axe: 0 });
      } finally { await context.close(); }
    }
  }
  await checkEngineError(browser, base, prefix);
  if (process.env.HEADER_SEARCH_REPORT) writeFileSync(process.env.HEADER_SEARCH_REPORT, JSON.stringify(report, null, 2) + '\n');
  console.log(`Header search: ${report.cases.length} bilingual responsive states passed axe and keyboard/pointer flows, plus metadata, no-script, stale and error checks.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const prefix = getPathPrefix();
  const server = await serveFixtureSite(process.env.REVIEW_ROOT || process.cwd(), prefix);
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try { await checkHeaderSearch(browser, server.base, prefix); }
  finally { await browser.close(); await server.close(); }
}
