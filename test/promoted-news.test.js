import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { load } from 'cheerio';
import { getPathPrefix } from '../lib/urls.js';
import MarkdownIt from 'markdown-it';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const slugs = ['europe-day-in-kutaisi', 'announcement-clarification-on-erasmus-opportunities-for-education-institutions-in-georgia', 'neo-dissemination-event-2025', 'eve-statistics', 'information-about-capacity-building-project-proposals'];
const md = new MarkdownIt();
// Shortened links resolved to direct EU topic pages on 2026-10-27 (docs/NEWS-PROMOTION.md).
const topic = 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/';
const direct = { KUPQy: 'ERASMUS-EDU-2026-CBHE-REGION-2', euXGT: 'ERASMUS-EDU-2026-CB-VET-NE', c3UWa: 'ERASMUS-YOUTH-2026-CB-NE', zx4x2: 'ERASMUS-SPORT-2026-CB' };
const resolve = body => body.replace(/\[https:\/\/shorturl\.at\/(\w+)\]\(https:\/\/shorturl\.at\/\1\)/g, (all, id) => direct[id] ? `[${direct[id]}](${topic}${direct[id]})` : all);
const links = body => [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]).sort();
test('five approved News splits preserve source wording except authorised corrections, and every body link', () => {
  for (const slug of slugs) {
    const source = read(`migration/review/news/${slug}.json`);
    source.sourceText.body = resolve(source.sourceText.body);
    if (slug === 'neo-dissemination-event-2025') {
      for (const [old, corrected] of Object.entries(read('test/fixtures/session-18-spelling.json'))) {
        source.sourceText.body = source.sourceText.body.replaceAll(old, corrected);
      }
    }
    if (slug === 'eve-statistics') source.sourceText.body = source.sourceText.body.replace('ჯამში ჩართულია 7 პროექტი', 'ჯამში 7 მონაწილეობა სამ დაფინანსებულ პროექტში');
    const item = read(`src/content/news/${slug}.json`);
    assert.equal(item.date, source.date);
    if (slug !== 'neo-dissemination-event-2025') assert.ok(!item.image);
    assert.deepEqual(links(item.ka.body + item.en.body), links(source.sourceText.body));
    for (const lang of ['ka', 'en']) {
      assert.ok(item[lang].title);
      assert.match(item[lang].body, lang === 'ka' ? /[ა-ჰ]/ : /[A-Za-z]/);
      assert.doesNotMatch(item[lang].body, /For (English|Georgian).*Scroll|ALT NEEDED/i);
      // Every retained paragraph is copied, allowing only the logged spelling/EVE corrections.
      for (const paragraph of item[lang].body.split('\n\n')) assert.ok(source.sourceText.body.includes(paragraph), `${slug}: ${paragraph}`);
      assert.ok(md.render(item[lang].body).length > 100);
    }
  }
});

test('promoted News render both languages with sequential headings', () => {
  for (const slug of slugs) for (const lang of ['ka', 'en']) {
    const html = readFileSync(`_site/${lang}/news/${slug}/index.html`, 'utf8');
    assert.doesNotMatch(load(html)('.news-article').text(), /\*\*/);
    let previous = 0;
    for (const match of html.matchAll(/<h([1-6])(?:\s[^>]*)?>/g)) {
      const level = Number(match[1]);
      assert.ok(level <= previous + 1, `${lang}/${slug}: h${previous} to h${level}`);
      previous = level;
    }
  }
});


test('only the approved dissemination photograph is attached with the approved bilingual alternatives', () => {
  const slug = 'neo-dissemination-event-2025';
  const item = read(`src/content/news/${slug}.json`);
  const alt = {
    ka: 'საკონფერენციო დარბაზში მსმენელები უყურებენ მომხსენებელსა და ეკრანზე ნაჩვენებ სლაიდს.',
    en: 'An audience watches a speaker beside a projected slide in a conference room.',
  };
  assert.deepEqual(item.image, { src: `/assets/uploads/${slug}.jpg`, alt });
  assert.deepEqual(readFileSync(`src${item.image.src}`), readFileSync(`migration/review/images/${slug}.jpg`));
  for (const lang of ['ka', 'en']) {
    for (const [path, loading] of [[`${lang}/news/${slug}/index.html`, 'eager'], [`${lang}/news/index.html`, 'lazy']]) {
      const $ = load(readFileSync(`_site/${path}`, 'utf8'));
      const img = $('main picture img').filter((_, el) => $(el).attr('alt') === alt[lang]);
      assert.equal(img.length, 1, path);
      assert.equal(img.attr('loading'), loading);
      assert.ok(Number(img.attr('width')) > 0 && Number(img.attr('height')) > 0);
      const picture = img.closest('picture');
      assert.equal(picture.find('source[type="image/avif"]').length, 1);
      assert.equal(picture.find('source[type="image/webp"]').length, 1);
      assert.ok(img.attr('src').startsWith(`${getPathPrefix()}assets/generated/news/`));
      assert.ok(existsSync('_site/' + img.attr('src').slice(getPathPrefix().length)));
    }
  }
});


test('the public News archive contains exactly five real posts, short source excerpts and article dates', () => {
  for (const lang of ['ka', 'en']) {
    const listing = load(readFileSync(`_site/${lang}/news/index.html`, 'utf8'));
    const cards = listing('.cards-news > li');
    assert.equal(cards.length, 5);
    assert.doesNotMatch(cards.text(), /\[SAMPLE\]/);
    for (const slug of slugs) {
      const item = read(`src/content/news/${slug}.json`);
      const link = listing(`.cards-news a[href="${getPathPrefix()}${lang}/news/${slug}/"]`);
      assert.equal(link.text(), item[lang].title);
      const card = link.closest('li');
      assert.equal(card.find('.card-body > p').length, 1);
      assert.equal(card.find('.card-body h1, .card-body h2, .card-body h3').length, 0);
      const sourceText = load(md.render(item[lang].body)).text().replace(/\s+/g, ' ');
      assert.ok(sourceText.includes(card.find('.card-body').text().replace(/\s+/g, ' ').trim().replace(/…$/, '')));
      const article = load(readFileSync(`_site/${lang}/news/${slug}/index.html`, 'utf8'));
      assert.equal(article('.news-article > p time').attr('datetime'), item.date);
      assert.equal(article('article').attr('aria-labelledby'), 'page-title');
    }
  }
});


test('archive rendering fixes malformed emphasis and retains every official topic link', () => {
  for (const lang of ['ka', 'en']) {
    const $ = load(readFileSync(`_site/${lang}/news/information-about-capacity-building-project-proposals/index.html`, 'utf8'));
    assert.doesNotMatch($('.news-article').text(), /\*\*/);
    assert.equal($('.news-article a').length, 4);
    const eve = load(readFileSync(`_site/${lang}/news/eve-statistics/index.html`, 'utf8'));
    assert.equal(eve('.news-article ol').first().find('li > strong').first().text(), 'ARIVE');
    for (const [code, id] of Object.entries(direct)) {
      assert.equal($(`.news-article a[href="${topic}${id}"]`).text(), id, code);
    }
  }
});
