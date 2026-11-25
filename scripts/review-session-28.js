// Captures and template walk for the two source revisions. Outside deployment.
import assert from 'node:assert/strict';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { buildFixtureSite, createFixtureSite, serveFixtureSite } from './fixture-site.js';

const phase = process.env.REVIEW_PHASE || 'after';
const output = resolve(process.env.REVIEW_OUTPUT || `docs/review/session-28/${phase}`);
const root = process.env.REVIEW_ROOT || process.cwd();
const routes = {
  home: '', opportunities: 'opportunities/', action: 'opportunities/cbhe/',
  calls: 'calls/', events: 'events/', calendar: 'events/calendar/', news: 'news/',
  article: 'news/neo-dissemination-event-2025/', resources: 'resources/',
  publications: 'resources/publications/', projects: 'resources/projects/',
  projectYear: 'resources/projects/2022/', statistics: 'resources/statistics/',
  map: 'resources/statistics/#participant-map', faq: 'resources/faq/', about: 'about/',
  team: 'about/team/', here: 'about/here/', contact: 'about/contact/',
  find: 'find/', student: 'find/student/', university: 'find/university/',
  youth: 'find/youth/', vet: 'find/vet/', sport: 'find/sport/',
  partners: 'opportunities/find-partners/', search: 'search/', privacy: 'privacy/',
  accessibility: 'accessibility/', credits: 'about/credits/',
};
const captured = new Set(['home', 'opportunities', 'action', 'events', 'news', 'contact',
  'article', 'statistics', 'publications', 'calls', 'find', 'stories']);
const audit = [];
const screenshots = [];
await mkdir(output, { recursive: true });
const site = await serveFixtureSite(root);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'],
});
const page = await browser.newPage();
let fixtureRoot;
let fixtureServer;
try {
  if (!process.env.REVIEW_SKIP_FIXTURES) {
    process.chdir(root);
    fixtureRoot = createFixtureSite(['event', 'call', 'story', 'publication']);
    buildFixtureSite(fixtureRoot);
    fixtureServer = await serveFixtureSite(fixtureRoot);
  }
  async function inspect(siteName, lang, view, url, capture = false) {
    const response = await page.goto(url);
    if (response) assert.equal(response.status(), 200, url);
    else assert.equal(page.url(), url);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const style = getComputedStyle(h1);
      return {
        title: h1.textContent.trim(), language: document.documentElement.lang,
        headingSize: style.fontSize, headingLineHeight: style.lineHeight,
        horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
        cards: document.querySelectorAll('main .card').length,
        creditControls: document.querySelectorAll('main .photo-credit-control').length,
        scrollRegions: document.querySelectorAll('main [tabindex="0"][role="group"]').length,
      };
    });
    audit.push({ site: siteName, lang, width: page.viewportSize().width, view, ...metrics });
    if (capture) {
      // Decode lazy images explicitly so full-page captures include below-fold media.
      await page.evaluate(async () => {
        for (const image of document.images) {
          image.loading = 'eager';
          await image.decode();
        }
      });
      await screenshot(view, lang, { fullPage: true });
    }
  }
  async function screenshot(name, lang, options = {}, locator = page) {
    const file = `${name}-${lang}-${page.viewportSize().width}.jpg`;
    await locator.screenshot({ path: `${output}/${file}`, type: 'jpeg', quality: 83, ...options });
    screenshots.push(file);
  }
  async function hover(locator) {
    await locator.evaluate(element => element.scrollIntoView({ block: 'center' }));
    const target = await locator.elementHandle();
    await page.waitForFunction(element => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(x + width / 2, y + height / 2));
    }, target);
    const bounds = await locator.boundingBox();
    assert.ok(bounds);
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    assert.ok(await locator.evaluate(element => element.matches(':hover')));
  }
  for (const lang of ['ka', 'en']) {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [view, path] of Object.entries(routes)) {
        await inspect('preview', lang, view, `${site.base}/${lang}/${path}`, captured.has(view));
      }
      await inspect('preview', lang, '404', `${site.base}/404.html${lang === 'en' ? '#not-found-en' : ''}`);
      if (fixtureServer) {
        for (const [view, path] of Object.entries({
          stories: 'stories/', story: 'stories/example/', event: 'events/information-day/',
          openCalls: 'calls/',
        })) {
          await inspect('fixture', lang, view, `${fixtureServer.base}/${lang}/${path}`, captured.has(view));
        }
      }
      const hero = page.locator('.home-hero');
      const card = page.locator('.audience-tiles .card').first();
      for (const state of ['hover', 'focus']) {
        await page.goto(`${site.base}/${lang}/`);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => scrollTo(0, 0));
        for (const [name, button] of [['primary', hero.locator('.button').first()], ['secondary', hero.locator('.button').last()]]) {
          if (state === 'hover') await hover(button);
          else {
            await page.keyboard.press('Tab');
            await button.focus();
          }
          await screenshot(`hero-${name}-${state}`, lang, {}, hero);
        }
        if (state === 'hover') await hover(card);
        else await card.locator('.card-primary').focus();
        await screenshot(`card-${state}`, lang, {}, page.locator('.audience-tiles'));
      }
      await screenshot('footer', lang, {}, page.locator('.site-footer'));
    }
  }
  await writeFile(`${output}/audit.json`, JSON.stringify(audit, null, 2) + '\n');
  await writeFile(`${output}/screenshots.json`, JSON.stringify(screenshots, null, 2) + '\n');
  console.log(`${phase}: ${audit.length} template views, ${screenshots.length} captures`);
} finally {
  await browser.close();
  await site.close();
  await fixtureServer?.close();
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
}
