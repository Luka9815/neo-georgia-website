import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import getViews from '../src/_data/views.js';
test('production Pagefind indexes have only their own language and exclude utility pages', () => {
  for (const lang of ['ka', 'en']) {
    const entry = JSON.parse(readFileSync(`_site/pagefind/${lang}/pagefind-entry.json`));
    assert.deepEqual(Object.keys(entry.languages), [lang]);
    assert.equal(entry.languages[lang].page_count, getViews().filter(view => view.lang === lang && !['redirect', 'legacyRedirect', '404', 'search'].includes(view.kind)).length);
  }
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /run: npm run build/);
});

import { load } from 'cheerio';
import { getPathPrefix } from '../lib/urls.js';
import { GEORGIAN_ENDINGS, queryVariants, stripGeorgianEnding, searchWithFallback } from '../src/assets/js/georgian-search.js';
test('Georgian fallback removes at most one longest ending and keeps four letters', () => {
  assert.equal(stripGeorgianEnding('მობილობის'), 'მობილობ');
  assert.equal(stripGeorgianEnding('თანამშრომლობის'), 'თანამშრომლობ');
  assert.equal(stripGeorgianEnding('ერასმუსის'), 'ერასმუს');
  assert.equal(stripGeorgianEnding('მობილობა'), 'მობილობა');
  assert.equal(stripGeorgianEnding('კარის'), 'კარის');
  assert.equal(stripGeorgianEnding('აბგდებისთვის'), 'აბგდ');
  assert.equal(stripGeorgianEnding('აბგდსისთვის'), 'აბგდს'); // Do not remove a second suffix.
  assert.deepEqual(queryVariants('მობილობის თანამშრომლობის!', 'ka'), ['მობილობის თანამშრომლობის!', 'მობილობ თანამშრომლობ!']);
  assert.deepEqual(queryVariants('mobility მობილობის', 'en'), ['mobility მობილობის']);
  assert.deepEqual(queryVariants(' ', 'ka'), []);
  for (let i = 1; i < GEORGIAN_ENDINGS.length; i++) assert.ok(GEORGIAN_ENDINGS[i - 1].length >= GEORGIAN_ENDINGS[i].length);
});
test('fallback preserves typed ranking, de-duplicates pages and leaves English unchanged', async () => {
  const calls = [];
  const engine = { async search(query) { calls.push(query); return { results: (query === 'მობილობის' ? ['b', 'a'] : ['a', 'c']).map(id => ({ id })) }; } };
  assert.deepEqual((await searchWithFallback(engine, 'მობილობის', 'ka')).map(result => result.id), ['b', 'a', 'c']);
  assert.deepEqual(calls, ['მობილობის', 'მობილობ']);
  calls.length = 0;
  await searchWithFallback(engine, 'mobility', 'en');
  assert.deepEqual(calls, ['mobility']);
});
test('search markup loads only on search pages, has active index and no-JS section links', () => {
  const prefix = getPathPrefix();
  for (const view of getViews()) {
    const $ = load(readFileSync(`_site${view.path}${view.path.endsWith('/') ? 'index.html' : ''}`, 'utf8'));
    assert.equal($('script[src$="/search.js"]').length, view.kind === 'search' ? 1 : 0);
    if (view.kind !== 'search') continue;
    assert.equal($('[data-search]').attr('data-index'), `${prefix}pagefind/${view.lang}/pagefind.js`);
    assert.equal($('label[for=search-query]').length, 1);
    assert.equal($('[aria-live=polite]').length, 1);
    assert.equal($('[data-search-form][hidden]').length, 1);
    assert.equal($('[data-search-fallback] a').length, 7);
    assert.equal($('header nav').first().find('li').length, 7);
    assert.ok($('.eu-footer').length);
    assert.equal($('header a[hreflang]').attr('href'), `${prefix}${view.lang === 'ka' ? 'en' : 'ka'}/search/`);
  }
});
