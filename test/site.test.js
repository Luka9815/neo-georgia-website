import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import { loadContent, callStatus, eventStatus, localise, dateLabel } from '../lib/content.js';
import getViews from '../src/_data/views.js';
const read = path => readFileSync(path, 'utf8');
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]); }
function output(path) { return `_site${path}${path.endsWith('/') ? 'index.html' : ''}`; }
test('all rendered pages have language, metadata, seven menu links, one h1 and EU footer', () => {
  assert.equal(files('_site').filter(f => f.endsWith('.html')).length, getViews().length);
  for (const view of getViews()) {
    const $ = load(read(output(view.path)));
    assert.equal($('html').attr('lang'), view.lang, view.path);
    assert.equal($('h1').length, 1, view.path);
    assert.ok($('h1').text().trim(), view.path);
    assert.equal($('header nav li').length, 7);
    assert.ok($('link[rel=canonical]').attr('href'));
    assert.ok($('meta[name=description]').attr('content'));
    assert.match($('.eu-footer').text(), view.lang === 'en' ? /Neither the European Union nor EACEA can be held responsible for them\./ : /TODO: Georgian disclaimer, to be approved by NEO/);
    assert.ok($('.emblem-placeholder').text().includes('[SAMPLE]'));
    assert.equal($('header a[hreflang]').attr('href'), view.alternate);
    if (view.translated === false) assert.equal($('link[rel=alternate]').length, 1);
    else assert.equal($('link[rel=alternate]').length, 2);
  }
});
test('every internal link, fragment, and stylesheet resolves', () => {
  for (const file of files('_site').filter(f => f.endsWith('.html'))) {
    const $ = load(read(file));
    for (const element of $('a[href], link[rel=stylesheet]')) {
      const href = $(element).attr('href');
      if (/^https?:/.test(href)) continue;
      assert.ok(href.startsWith('/') || href.startsWith('#'), `${file}: ${href}`);
      const [path, hash] = href.split('#');
      const target = path ? output(path) : file;
      assert.ok(existsSync(target), `${file}: missing ${target}`);
      if (hash) assert.ok(load(read(target))(`[id="${hash}"]`).length, `${file}: missing #${hash}`);
    }
  }
});
test('call boundaries, event end, and Brussels summer and winter dates', () => {
  const item = { opens: '2026-01-01T00:00:00+01:00', deadline: '2026-06-01T17:00:00+02:00' };
  assert.equal(callStatus(item, new Date('2025-12-01')), 'upcoming');
  assert.equal(callStatus(item, new Date(item.opens)), 'open');
  assert.equal(callStatus(item, new Date(item.deadline)), 'open');
  assert.equal(callStatus(item, new Date('2026-06-01T15:00:00.001Z')), 'closed');
  assert.equal(eventStatus({ end: item.deadline }, new Date('2026-06-01T16:00Z')), 'past');
  assert.equal(eventStatus({ end: item.deadline }, new Date('2026-06-01T14:00Z')), 'upcoming');
  const en = JSON.parse(read('src/_data/en.json')), ka = JSON.parse(read('src/_data/ka.json'));
  assert.equal(dateLabel('2026-06-01T15:00Z', en), '1 June 2026, 17:00');
  assert.equal(dateLabel('2026-12-01T16:00Z', en), '1 December 2026, 17:00');
  assert.equal(dateLabel('2026-12-01T16:00Z', ka), '1 დეკემბერი 2026, 17:00');
});
test('content relationships, sample marking, and core bilingual parity', () => {
  const data = loadContent();
  for (const [type, items] of Object.entries(data)) {
    for (const item of items) {
      assert.match(item.slug, /^[a-z0-9-]+$/);
      for (const lang of ['ka', 'en']) {
        if (['action', 'call', 'event', 'faq', 'page', 'person'].includes(type)) assert.ok(item[lang]);
        if (item[lang]) { assert.match(item[lang].title, /^\[SAMPLE\]/); assert.match(item[lang].body, /^\[SAMPLE\]/); }
      }
      for (const slug of item.actions || (item.action ? [item.action] : [])) assert.ok(data.action.some(a => a.slug === slug));
      if (item.event) assert.ok(data.event.some(e => e.slug === item.event));
      if (type === 'resource') { assert.ok(['official','neo','partner'].includes(item.source)); assert.ok(item.url); }
      if (type === 'call') { assert.equal(item.timeZone, 'Europe/Brussels'); assert.match(item.deadline, /[+]0[12]:00$/); }
      assert.equal(item.status, undefined);
    }
  }
  assert.equal(localise(data.news, 'en').length, 2);
  assert.ok(!existsSync('_site/en/news/update-3/index.html'));
  assert.match(read('_site/ka/news/update-3/index.html'), /href="\/en\/news\/" lang="en"/);
});
test('home has six blocks and action page includes every relationship block', () => {
  for (const lang of ['ka', 'en']) {
    assert.equal(load(read(`_site/${lang}/index.html`))('main > section').length, 6);
    const $ = load(read(`_site/${lang}/opportunities/cbhe/index.html`));
    assert.equal($('main > section').length, 8);
    assert.ok($('main a[href$="/events/past-session/"]').length);
    assert.ok($('main a[href$="/stories/example/"]').length);
    assert.ok($('main a[href$="/events/information-day/"]').length);
  }
});
