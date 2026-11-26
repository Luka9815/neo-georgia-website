// Screenshots of the rendered site. The baseline is the clean Session 28 output.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { serveFixtureSite } from './fixture-site.js';

const beforeRoot = process.env.REVIEW_BEFORE;
assert.ok(beforeRoot, 'Set REVIEW_BEFORE to the baseline checkout with its built _site.');
const directory = resolve('docs/review/session-29');
const baseline = await serveFixtureSite(beforeRoot);
const current = await serveFixtureSite(process.cwd());
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const captures = [];
try {
  async function visit(url) {
    assert.equal((await page.goto(url)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
  }

  async function capture(phase, name, lang, locator = page) {
    const width = page.viewportSize().width;
    const file = `${phase}/${name}-${lang}-${width}.jpg`;
    await mkdir(`${directory}/${phase}`, { recursive: true });
    await locator.screenshot({ path: `${directory}/${file}`, type: 'jpeg', quality: 86 });
    captures.push({ phase, name, lang, width, file });
  }

  for (const lang of ['ka', 'en']) for (const width of [390, 1280]) {
    const home = `${current.base}/${lang}/`;
    const query = lang === 'ka' ? 'ერაზმუს მუნდუსი' : 'Erasmus Mundus';
    const input = page.locator('#header-search-query');
    await page.setViewportSize({ width, height: 900 });
    await visit(home);
    await page.locator('button.search-link').waitFor();
    await capture('after', 'header-closed', lang);
    await page.locator('button.search-link').click();
    await capture('after', 'header-empty', lang);

    await input.fill(query);
    await page.locator('.header-search-result').first().waitFor();
    await input.press('ArrowDown');
    await capture('after', 'header-results', lang);
    await input.fill('zzqxxnoresult');
    const message = page.locator('.header-search-message:visible');
    await page.waitForFunction(() => document.querySelector('.header-search-message').textContent.includes('zzqxxnoresult'));
    assert.equal(await message.count(), 1);
    await capture('after', 'header-no-results', lang);

    const full = new URL('search/', home);
    full.searchParams.set('q', query);
    await visit(full.href);
    await page.locator('[data-search-list] a').first().waitFor();
    assert.equal(await page.locator('#search-query').inputValue(), query);
    await capture('after', 'search-prefill', lang);

    await page.setViewportSize({ width, height: 1450 });
    for (const [phase, base] of [['before', baseline.base], ['after', current.base]]) {
      await visit(`${base}/${lang}/`);
      const figures = page.locator('.home-figures');
      await figures.locator('img').evaluate(async image => { image.loading = 'eager'; await image.decode(); });
      if (phase === 'after') assert.equal(await page.locator('.figures-data').getAttribute('open'), null);
      for (const [name, section] of [['figures', figures], ['updates', page.locator('.home-updates')]]) {
        await section.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 180));
        await page.waitForFunction(() => document.querySelector('.site-header').hasAttribute('data-compact'));
        await capture(phase, name, lang, section);
      }
    }
  }
  await writeFile(`${directory}/screenshots.json`, JSON.stringify(captures, null, 2) + '\n');
  console.log(`${captures.length} bilingual Session 29 captures`);
} finally {
  await browser.close();
  await baseline.close();
  await current.close();
}
