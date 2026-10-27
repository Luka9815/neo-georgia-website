import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { createHash } from 'node:crypto';
import { getPathPrefix } from '../lib/urls.js';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const dissemination = 'neo-dissemination-event-2025';
const clarification = 'announcement-clarification-on-erasmus-opportunities-for-education-institutions-in-georgia';
const digits = text => text.match(/\d[\d,.]*/g);
const baseline = read('test/fixtures/session-18-editorial-baseline.json');
const hash = text => createHash('sha256').update(text).digest('hex');

test('editorial corrections preserve all published numeric tokens and original evidence', () => {
  for (const slug of [dissemination, 'eve-statistics']) {
    const item = read(`src/content/news/${slug}.json`);
    for (const lang of ['ka', 'en']) {
      assert.deepEqual(digits(item[lang].body), baseline[slug][lang].numbers);
      assert.equal(hash(item.en.body), baseline[slug].en.sha256);
    }
  }
  const spelling = read('test/fixtures/session-18-spelling.json');
  const body = read(`src/content/news/${dissemination}.json`).ka.body;
  for (const [old, corrected] of Object.entries(spelling)) {
    assert.ok(!body.includes(old), old);
    assert.ok(body.includes(corrected), corrected);
    // Exact forward paragraph preservation is checked by promoted-news.test.js.
  }
  assert.ok(read('src/content/news/eve-statistics.json').ka.body.includes('ჯამში 7 მონაწილეობა სამ დაფინანსებულ პროექტში'));
});

test('clarification note is bilingual, dated, above the unchanged article and links to current Actions', () => {
  const item = read(`src/content/news/${clarification}.json`);
  const source = read(`migration/review/news/${clarification}.json`).sourceText.body;
  for (const lang of ['ka', 'en']) {
    assert.equal(hash(item[lang].body), baseline[clarification][lang].sha256);
    assert.ok(source.includes(item[lang].body));
    const $ = load(readFileSync(`_site/${lang}/news/${clarification}/index.html`, 'utf8'));
    assert.ok($('.news-article > :first-child').hasClass('historical-note'));
    assert.equal($('.historical-note time').attr('datetime'), '2026-10-27');
    assert.ok($('.historical-note').text().includes(item.historicalNote[lang]));
    assert.equal($('.historical-note a').attr('href'), `${getPathPrefix()}${lang}/opportunities/`);
    assert.equal($('.news-article > p time').attr('datetime'), item.date);
  }
});
