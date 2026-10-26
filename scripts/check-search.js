import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { load } from 'cheerio';
import getViews from '../src/_data/views.js';
export async function checkSearch(browser, base, prefix) {
  const report = { prefix, measuredAt: new Date().toISOString(), languages: {} };
  for (const lang of ['ka', 'en']) {
    const context = await browser.newContext({ viewport: { width: 320, height: 900 } });
    const page = await context.newPage();
    const requests = [];
    const responses = [];
    const bytes = [];
    page.on('request', request => requests.push(new URL(request.url()).pathname));
    page.on('response', response => responses.push(response.body().then(body => bytes.push({ path: new URL(response.url()).pathname, bytes: body.length }))));
    await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    try {
      await page.goto(`${base}${prefix}${lang}/search/`);
      await page.locator('[data-search-form]').waitFor({ state: 'visible' });
      assert.equal(await page.locator('.language-switch').evaluate(link => { const range = document.createRange(); range.selectNodeContents(link); return range.getClientRects().length; }), 1, 'Language control must stay on one line at 320px');
      await Promise.all(responses);
      const initialSearchBytes = bytes.filter(item => item.path.includes('/assets/js/')).reduce((sum, item) => sum + item.bytes, 0);
      assert.ok(!requests.some(path => path.includes('/pagefind/')), 'Index must load on search, not page entry');
      const input = page.locator('#search-query');
      await input.fill(lang === 'ka' ? 'მობილობის' : 'mobility');
      await input.press('Enter');
      await page.waitForFunction(() => document.querySelector('[data-search-list] a'));
      assert.ok(await page.locator('[data-search-status]').textContent());
      assert.equal(await page.locator(':focus').getAttribute('id'), 'search-query');
      const links = await page.locator('[data-search-list] a').evaluateAll(links => links.map(link => new URL(link.href).pathname));
      assert.equal(new Set(links).size, links.length);
      for (const link of links) assert.ok(link.startsWith(`${prefix}${lang}/`), link);
      await Promise.all(responses);
      const firstQuerySearchBytes = bytes.filter(item => item.path.includes('/pagefind/') || item.path.includes('/assets/js/')).reduce((sum, item) => sum + item.bytes, 0);
      assert.ok(!requests.some(path => path.includes(`/pagefind/${lang === 'ka' ? 'en' : 'ka'}/`)), 'Other-language index loaded');
      const queries = [];
      for (const query of lang === 'ka' ? ['მობილობა', 'მობილობის', 'თანამშრომლობა', 'თანამშრომლობის', 'ერასმუსის'] : ['mobility', 'cooperation', 'Erasmus', 'მობილობა']) {
        const result = await page.evaluate(async ({ query, lang, prefix }) => {
          const engine = await import(`${prefix}pagefind/${lang}/pagefind.js`);
          const { searchWithFallback, queryVariants } = await import(`${prefix}assets/js/georgian-search.js`);
          const typed = (await engine.search(query)).results;
          const merged = await searchWithFallback(engine, query, lang);
          const urls = async results => Promise.all(results.map(async result => (await result.data()).url));
          return { variants: queryVariants(query, lang), before: await urls(typed), after: await urls(merged), exactFirst: typed.every((result, index) => merged[index]?.id === result.id) };
        }, { query, lang, prefix });
        assert.equal(result.exactFirst, true);
        if (lang === 'en') assert.deepEqual(result.before, result.after);
        for (const url of result.after) assert.ok(url.startsWith(`${prefix}${lang}/`));
        const family = query.startsWith('მობილობ') ? 'მობილობ' : query.startsWith('თანამშრომლობ') ? 'თანამშრომლობ' : query.startsWith('ერასმუს') ? 'ერასმუს' : null;
        const relevant = lang === 'ka' && family ? getViews().filter(view => view.lang === lang && !['search', '404', 'redirect', 'legacyRedirect'].includes(view.kind)).filter(view => {
          const $ = load(readFileSync(`_site${view.path}index.html`, 'utf8')); $('.notice').remove(); return $('main').text().includes(family);
        }).map(view => prefix + view.path.slice(1)) : [];
        queries.push({ query, ...result, relevant: relevant.length, beforeRecall: relevant.filter(url => result.before.includes(url)).length, afterRecall: relevant.filter(url => result.after.includes(url)).length });
      }
      report.languages[lang] = { initialSearchBytes, firstQuerySearchBytes, requests, queries };
      // No-script visitors retain the seven section links and exact language switch.
      const noJs = await browser.newContext({ javaScriptEnabled: false });
      const plain = await noJs.newPage();
      await plain.goto(`${base}${prefix}${lang}/search/`);
      assert.equal(await plain.locator('[data-search-form]').isVisible(), false);
      assert.equal(await plain.locator('[data-search-fallback]').isVisible(), true);
      assert.equal(await plain.locator('[data-search-fallback] a').count(), 7);
      await noJs.close();
    } finally { await context.close(); }
  }
  // Browsing ordinary pages must never fetch search modules or indexes.
  const context = await browser.newContext(); const page = await context.newPage(); const requests = [];
  page.on('request', request => requests.push(request.url()));
  for (const lang of ['ka', 'en']) await page.goto(`${base}${prefix}${lang}/`);
  assert.ok(!requests.some(url => /pagefind|\/search\.js|georgian-search/.test(url)));
  await context.close();
  if (process.env.SEARCH_REPORT) writeFileSync(process.env.SEARCH_REPORT, JSON.stringify(report, null, 2) + '\n');
  console.log('Search: keyboard submit, typed ordering, language isolation, no-JS links and search-only loading passed.');
}
