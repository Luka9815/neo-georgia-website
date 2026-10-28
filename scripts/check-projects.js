import assert from 'node:assert/strict';

export async function checkProjects(browser, base, prefix) {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  try {
    const page = await context.newPage();
    for (const lang of ['ka', 'en']) {
      await page.goto(`${base}${prefix}${lang}/resources/statistics/`);
      assert.equal(await page.locator('[data-project-total]').textContent(), '6764');
      assert.equal(await page.locator('[data-project-organisations]').textContent(), '605');
      assert.equal(await page.locator('[data-project-participations]').textContent(), '5079');
      await page.goto(`${base}${prefix}${lang}/opportunities/cbhe/`);
      await page.locator(`main a[href="${prefix}${lang}/resources/projects/#action-cbhe"]`).click();
      await eventually(async () => await page.locator('.project-action-index > section:visible').count() === 1, `Action index filter: ${lang}`);
      await page.locator('#action-cbhe a').first().click();
      assert.ok(page.url().endsWith('#action-cbhe'));
      await eventually(async () => await page.locator('.project-groups > section:visible').count() === 1, `Year group filter: ${lang}`);
      const region = page.locator('#action-cbhe .project-table-scroll');
      await region.focus();
      await page.keyboard.press('ArrowRight');
      let scrolled = false;
      for (let attempt = 0; attempt < 40; attempt++) {
        if (await region.evaluate(el => el.scrollLeft > 0)) { scrolled = true; break; }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      assert.ok(scrolled, `Project table keyboard scrolling: ${lang}`);
      assert.ok(await region.locator('tbody tr').count() > 0);
      assert.equal(await page.locator('[data-project-attribution]').count(), 1);
      await page.locator('main a[href="#projects-all"]').click();
      await eventually(async () => await page.locator('.project-groups > section:visible').count() === await page.locator('.project-groups > section').count(), `All projects reset: ${lang}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
  } finally { await context.close(); }
  console.log('Projects: bilingual no-JS totals, Action/year navigation and keyboard table scrolling passed.');
}

async function eventually(check, message) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await check()) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.fail(message);
}
