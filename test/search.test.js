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
