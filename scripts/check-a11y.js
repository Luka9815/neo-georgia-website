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
  for (const width of [360, 1280]) {
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
  console.log(
    `axe: ${count} pages passed with zero violations; ` +
      '320px overflow, keyboard skip links, language switches and no-JS mobile/desktop menus passed.'
  );
} finally {
  await browser.close();
}
