import assert from 'node:assert/strict';

export async function checkCalendar(browser, base, prefix) {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  try {
    const page = await context.newPage();
    for (const lang of ['ka', 'en']) {
      await page.goto(`${base}${prefix}${lang}/events/`);
      await page.locator(`main a[href="${prefix}${lang}/events/calendar/"]`).click();
      assert.equal(await page.locator('.event-calendar').count() > 0, true);
      const scroll = page.locator('.calendar-scroll').first();
      await scroll.focus();
      assert.equal(await page.locator(':focus').getAttribute('role'), 'region');
      await page.keyboard.press('ArrowRight');
      // Poll in Node: page requestAnimationFrame is unavailable when JS is disabled.
      await assertEventually(async () => await scroll.evaluate(el => el.scrollLeft) > 0);
      if (await page.locator('.event-calendar a').count()) {
        await page.keyboard.press('Tab');
        const link = page.locator(':focus');
        assert.match(await link.getAttribute('href'), new RegExp(`^${prefix}${lang}/events/`));
        await page.keyboard.press('Enter');
      } else {
        assert.equal(await page.locator('[data-events-empty]').count(), 1);
        await page.locator('main a[download]').focus();
      }
      const download = page.locator('main a[download]');
      const response = await context.request.get(`${base}${await download.getAttribute('href')}`);
      assert.equal(response.status(), 200);
      const ics = await response.text();
      assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
      if (await page.locator('[data-events-empty]').count()) assert.doesNotMatch(ics, /BEGIN:VEVENT/);
    }
  } finally { await context.close(); }
}

async function assertEventually(check) {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await check()) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.fail('Calendar did not scroll after ArrowRight');
}
