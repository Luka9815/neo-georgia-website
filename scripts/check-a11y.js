import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import getViews from '../src/_data/views.js';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const context = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  const base = process.env.TEST_URL || 'http://127.0.0.1:8080';
  let count = 0;
  for (const view of getViews().filter(v => v.kind !== 'redirect')) {
    const response = await page.goto(`${base}${view.path}`);
    assert.equal(response.status(), 200, view.path);
    const results = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], view.path);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${view.path}`);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('href'), '#main', `Skip link: ${view.path}`);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
    const alternate = page.locator('header a[hreflang]');
    const target = await alternate.getAttribute('href');
    await alternate.click();
    assert.equal(new URL(page.url()).pathname, target);
    count++;
  }
  console.log(`axe: ${count} pages passed with zero violations; 320px overflow, keyboard skip links and language switches passed.`);
} finally { await browser.close(); }
