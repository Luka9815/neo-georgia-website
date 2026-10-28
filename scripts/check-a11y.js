import { checkContentFixtures } from './check-content-fixtures.js';
import { checkCalendar } from './check-calendar.js';
import { checkProjects } from './check-projects.js';
import { checkSearch } from './check-search.js';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import getViews from '../src/_data/views.js';
import { getPathPrefix } from '../lib/urls.js';
const prefix = getPathPrefix();
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  const context = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  const base = process.env.TEST_URL || 'http://127.0.0.1:8080';
  let count = 0;
  for (const view of getViews().filter(
    (v) => !['redirect', 'legacyRedirect'].includes(v.kind)
  )) {
    const response = await page.goto(`${base}${prefix}${view.path.slice(1)}`);
    assert.equal(response.status(), 200, view.path);
    await page.evaluate(() => document.fonts.ready);
    assert.ok(
      await page.evaluate(() =>
        [...document.fonts].some(
          (font) => font.family.includes('NEO Noto Sans') && font.status === 'loaded'
        )
      ),
      `Local font: ${view.path}`
    );
    const results = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
      view.path
    );
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Horizontal overflow: ${view.path}`
    );
    await page.keyboard.press('Tab');
    assert.equal(
      await page.locator(':focus').getAttribute('href'),
      '#main',
      `Skip link: ${view.path}`
    );
    await page.keyboard.press('Enter');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
    const alternate = page.locator('header a[hreflang]');
    const target = await alternate.getAttribute('href');
    const destination = new URL(target, page.url()).href;
    await alternate.click();
    assert.equal(page.url(), destination);
    count++;
  }
  // Native disclosure navigation must remain usable with page JavaScript disabled.
  for (const width of [320, 360, 600, 768, 1024, 1280]) {
    const noJs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
    });
    const menuPage = await noJs.newPage();
    for (const lang of ['ka', 'en']) {
      await menuPage.goto(`${base}${prefix}${lang}/`);
      await menuPage.evaluate(() => document.fonts.ready);
      assert.ok(
        await menuPage.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      );
      assert.equal(await menuPage.locator('.audience-tiles li').count(),5);
      assert.equal(await menuPage.locator('.home-hero .entry a:visible').count(),2);
      const wordmark = await menuPage.locator('.brand').boundingBox();
      const emblem = await menuPage.locator('.eu-emblem').boundingBox();
      assert.ok(wordmark.width <= emblem.width && wordmark.height <= emblem.height, `EU emblem prominence: ${lang} at ${width}px`);
      assert.equal(await menuPage.locator('.eu-emblem').evaluate(image => getComputedStyle(image).backgroundColor), 'rgb(255, 255, 255)');
      if (width < 1024) {
        const summary = menuPage.locator('.mobile-menu summary');
        await summary.focus();
        await menuPage.keyboard.press('Enter');
        assert.equal(await menuPage.locator('.mobile-menu').getAttribute('open'), '');
        assert.equal(await menuPage.locator('.mobile-navigation a:visible').count(), 7);
        await menuPage.keyboard.press('Tab');
        assert.equal(
          await menuPage.locator(':focus').getAttribute('href'),
          `${prefix}${lang}/`
        );
        await summary.focus();
        await menuPage.keyboard.press('Space');
        assert.equal(await menuPage.locator('.mobile-menu').getAttribute('open'), null);
      } else {
        assert.equal(
          await menuPage.locator('.desktop-navigation a:visible').count(),
          7
        );
        assert.equal(await menuPage.locator('.mobile-menu').isVisible(), false);
      }
    }
    await noJs.close();
  }
  // Progressive filters: all files remain reachable without page JavaScript.
  for (const lang of ['ka', 'en']) {
    const url = `${base}${prefix}${lang}/resources/publications/`;
    await page.goto(url);
    const visible = page.locator('[data-publications] > li:visible');
    assert.equal(await visible.count(), 2);
    await page.locator('#publication-year').selectOption('2025');
    assert.equal(await visible.count(), 1);
    await page.locator('#publication-type').selectOption('brochure');
    assert.equal(await visible.count(), 0);
    assert.match(await page.locator('[role=status]').textContent(), /0$/);
    await page.locator('button[type=reset]').click();
    await page.waitForFunction(() => [...document.querySelectorAll('[data-publications] > li')].every(item => !item.hidden));
    assert.equal(await visible.count(), 2);
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const document = await noJs.newPage();
    await document.goto(url);
    assert.equal(await document.locator('[data-publications] > li:visible').count(), 2);
    assert.equal(await document.locator('[data-publication-filters]').isVisible(), false);
    await noJs.close();
  }
  // The approved photograph must decode, and Action labels remain visible without JS.
  for (const lang of ['ka', 'en']) {
    for (const suffix of ['news/', 'news/neo-dissemination-event-2025/']) {
      await page.goto(`${base}${prefix}${lang}/${suffix}`);
      const image = page.locator('main picture img.news-image');
      assert.equal(await image.count(), 1);
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
      assert.ok(await image.evaluate(image => image.naturalWidth > 0));
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
    const listing = await noJs.newPage();
    await listing.goto(`${base}${prefix}${lang}/opportunities/`);
    const cards = listing.locator('.cards-action > li');
    assert.equal(await cards.count(), 10); // Virtual Exchanges appears in two sectors.
    for (const card of await cards.all()) {
      assert.ok(await card.locator('.action-key-label').isVisible());
    }
    await noJs.close();
  }
  await checkCalendar(browser, base, prefix);
  await checkProjects(browser, base, prefix);
  await checkSearch(browser, base, prefix);
  await checkContentFixtures(browser, prefix);
  console.log(
    `axe: ${count} pages passed with zero violations; ` +
      '320px overflow, keyboard skip links, language switches and no-JS mobile/desktop menus passed.'
  );
} finally {
  await browser.close();
}
