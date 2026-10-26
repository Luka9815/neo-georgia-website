// Capture actual pages, with page JavaScript disabled, after local fonts settle.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { getPathPrefix } from '../lib/urls.js';
const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const base = process.env.TEST_URL || 'http://127.0.0.1:8080';
const output = process.env.SCREENSHOT_DIR || 'docs/review/session-5';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const width of [360, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    for (const lang of ['ka', 'en']) {
      await page.goto(`${base}${getPathPrefix()}${lang}/`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `${output}/${phase}-${lang}-${width}.png`,
        fullPage: true,
      });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
