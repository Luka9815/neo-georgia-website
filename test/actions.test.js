import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { loadContent } from '../lib/content.js';
import { getPathPrefix } from '../lib/urls.js';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const expected = {
  icm: ['higher-education'],
  'erasmus-mundus': ['higher-education'],
  cbhe: ['higher-education'],
  'jean-monnet': ['higher-education'],
  'cb-vet': ['vet'],
  'cb-youth': ['youth'],
  'youth-mobility': ['youth'],
  'virtual-exchanges': ['higher-education', 'youth'],
  'cb-sport': ['sport'],
};
const guide =
  'https://erasmus-plus.ec.europa.eu/sites/default/files/2025-11/programme-guide-2026_en.pdf';

test('nine bilingual Action drafts retain source evidence and stable relationships', () => {
  const actions = loadContent().action;
  assert.deepEqual(
    actions.map((item) => item.slug).sort(),
    Object.keys(expected).sort()
  );
  for (const item of actions) {
    assert.equal(item.programmeYear, 2026);
    assert.deepEqual(item.sectors, expected[item.slug]);
    assert.ok(item.comment.includes(guide));
    assert.match(item.comment, /12\/11\/2025/);
    assert.match(item.comment, /footnote 46/);
    assert.match(item.comment, /Part B pp?\./);
    assert.match(item.comment, /checked 2026-10-26/);
    assert.equal(item.officialLinks[0].url, guide);
    assert.equal(item.officialLinks[0].labelKey, 'programmeGuide2026');
    assert.ok(item.officialLinks.length >= 2);
    for (const link of item.officialLinks) {
      assert.equal(new URL(link.url).hostname, 'erasmus-plus.ec.europa.eu');
      assert.ok(item.comment.includes(link.url));
    }
    for (const lang of ['ka', 'en']) {
      const strings = read(`src/_data/${lang}.json`);
      for (const field of ['title', 'summary', 'who', 'how']) {
        assert.match(item[lang][field], /^\[DRAFT\] .+/);
      }
      for (const link of item.officialLinks) assert.ok(strings[link.labelKey]);
    }
  }
});

test('sector groups and every Action page show draft eligibility and official sources', () => {
  const shared = read('src/_data/georgiaEligibility.json');
  assert.match(shared.comment, /p\.34 Region 2 and footnote 46/);
  for (const lang of ['ka', 'en']) {
    const strings = read(`src/_data/${lang}.json`);
    const listing = load(
      readFileSync(`_site/${lang}/opportunities/index.html`, 'utf8')
    );
    assert.deepEqual(
      listing('.action-sector')
        .map((_, el) => listing(el).attr('id'))
        .get(),
      ['higher-education', 'vet', 'youth', 'sport']
    );
    for (const [sector, label] of Object.entries(strings.sectorLabels)) {
      assert.equal(listing(`#${sector} h3`).text(), label);
      const links = listing(`#${sector} h4 a`)
        .map((_, el) => listing(el).attr('href'))
        .get();
      assert.deepEqual(
        links.sort(),
        Object.entries(expected)
          .filter(([, sectors]) => sectors.includes(sector))
          .map(([slug]) => `${getPathPrefix()}${lang}/opportunities/${slug}/`)
          .sort()
      );
    }
    for (const item of loadContent().action) {
      const page = load(
        readFileSync(`_site/${lang}/opportunities/${item.slug}/index.html`, 'utf8')
      );
      assert.equal(page('h1').text(), item[lang].title);
      assert.equal(page('.eligibility-note').text().trim(), shared[lang]);
      assert.ok(page('main').text().includes(item[lang].who));
      for (const link of item.officialLinks) {
        assert.equal(
          page(`main a[href="${link.url}"]`).text(),
          strings[link.labelKey]
        );
      }
    }
  }
});
