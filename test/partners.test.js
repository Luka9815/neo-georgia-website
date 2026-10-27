import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { loadContent } from '../lib/content.js';
import { getPathPrefix } from '../lib/urls.js';

test('official partner tools have bilingual descriptions, checked dates and reachable entry links', () => {
  const data = JSON.parse(readFileSync('src/_data/partnerTools.json'));
  const hosts = new Set(['ec.europa.eu', 'erasmus-plus.ec.europa.eu', 'epale.ec.europa.eu', 'school-education.ec.europa.eu', 'www.salto-youth.net', 'salto-et.net']);
  for (const lang of ['ka', 'en']) {
    const path = `${getPathPrefix()}${lang}/opportunities/find-partners/`;
    const $ = load(readFileSync(`_site/${lang}/opportunities/find-partners/index.html`, 'utf8'));
    assert.equal($('.partner-tools > li').length, 8);
    assert.equal($('main time').attr('datetime'), data.checkedOn);
    for (const tool of data.tools) {
      assert.equal(new URL(tool.url).protocol, 'https:');
      assert.ok(hosts.has(new URL(tool.url).hostname));
      const item = $(`.partner-tools a[href="${tool.url}"]`).closest('li');
      assert.ok(item.find('h2').text().trim());
      assert.ok(item.find('p').text().trim());
    }
    for (const suffix of ['', ...loadContent().action.map(item => `${item.slug}/`)]) {
      const page = load(readFileSync(`_site/${lang}/opportunities/${suffix}index.html`, 'utf8'));
      assert.equal(page(`main a[href="${path}"]`).length, 1);
    }
  }
});
