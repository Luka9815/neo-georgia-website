import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import {
  loadContent,
  callStatus,
  eventStatus,
  localise,
  dateLabel,
  zonedDateTime,
  callYears,
} from '../lib/content.js';
import getViews from '../src/_data/views.js';
import getSite from '../src/_data/site.js';
import { getPathPrefix } from '../lib/urls.js';
const prefix = getPathPrefix();
const publicPath = (path) => prefix + path.replace(/^\//, '');
const read = (path) => readFileSync(path, 'utf8');
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]
  );
}
function output(path) {
  return `_site${path}${path.endsWith('/') ? 'index.html' : ''}`;
}
test('all rendered pages have language, metadata, seven menu links, one h1 and EU footer', () => {
  assert.equal(
    files('_site').filter((f) => f.endsWith('.html')).length,
    getViews().length
  );
  for (const view of getViews()) {
    const $ = load(read(output(view.path)));
    assert.equal($('html').attr('lang'), view.lang, view.path);
    assert.equal($('h1').length, 1, view.path);
    assert.ok($('h1').text().trim(), view.path);
    for (const menu of $('header nav')) assert.equal($(menu).find('li').length, 7);
    assert.equal($('header nav').length, 2);
    assert.ok($('link[rel=canonical]').attr('href'));
    assert.ok($('meta[name=description]').attr('content'));
    assert.match(
      $('.eu-footer').text(),
      view.lang === 'en'
        ? /Neither the European Union nor EACEA can be held responsible for them\./
        : /TODO: Georgian disclaimer, to be approved by NEO/
    );
    assert.ok($('.emblem-placeholder').text().includes('[SAMPLE]'));
    assert.equal($('header a[hreflang]').attr('href'), publicPath(view.alternate));
    if (view.translated === false) assert.equal($('link[rel=alternate]').length, 1);
    else assert.equal($('link[rel=alternate]').length, 2);
  }
});
test('every internal link, fragment, and stylesheet resolves', () => {
  for (const file of files('_site').filter((f) => f.endsWith('.html'))) {
    const $ = load(read(file));
    for (const element of $('a[href], link[rel=stylesheet]')) {
      const href = $(element).attr('href');
      if (/^https?:/.test(href)) continue;
      assert.ok(href.startsWith('/') || href.startsWith('#'), `${file}: ${href}`);
      const [path, hash] = href.split('#');
      if (path) assert.ok(path.startsWith(prefix), `${file}: unprefixed ${path}`);
      const target = path ? output('/' + path.slice(prefix.length)) : file;
      assert.ok(existsSync(target), `${file}: missing ${target}`);
      if (hash)
        assert.ok(
          load(read(target))(`[id="${hash}"]`).length,
          `${file}: missing #${hash}`
        );
    }
  }
});
test('call boundaries, event end, and Brussels summer and winter dates', () => {
  const item = {
    opens: '2026-01-01T00:00',
    deadline: '2026-06-01T17:00',
    timeZone: 'Europe/Brussels',
  };
  assert.equal(callStatus(item, new Date('2025-12-01')), 'upcoming');
  assert.equal(
    callStatus(item, new Date(zonedDateTime(item.opens, item.timeZone))),
    'open'
  );
  assert.equal(
    callStatus(item, new Date(zonedDateTime(item.deadline, item.timeZone))),
    'open'
  );
  assert.equal(callStatus(item, new Date('2026-06-01T15:00:00.001Z')), 'closed');
  assert.equal(
    eventStatus(
      { end: item.deadline, timeZone: item.timeZone },
      new Date('2026-06-01T16:00Z')
    ),
    'past'
  );
  assert.equal(
    eventStatus(
      { end: item.deadline, timeZone: item.timeZone },
      new Date('2026-06-01T14:00Z')
    ),
    'upcoming'
  );
  const en = JSON.parse(read('src/_data/en.json')),
    ka = JSON.parse(read('src/_data/ka.json'));
  assert.equal(dateLabel('2026-06-01T15:00Z', en), '1 June 2026, 17:00');
  assert.equal(dateLabel('2026-12-01T16:00Z', en), '1 December 2026, 17:00');
  assert.equal(dateLabel('2026-12-01T16:00Z', ka), '1 დეკემბერი 2026, 17:00');
});
test('content relationships, non-empty text, and core bilingual parity', () => {
  const data = loadContent();
  for (const [type, items] of Object.entries(data)) {
    for (const item of items) {
      assert.match(item.slug, /^[a-z0-9-]+$/);
      for (const lang of ['ka', 'en']) {
        if (['action', 'call', 'event', 'faq', 'page', 'person'].includes(type))
          assert.ok(item[lang]);
        if (item[lang]) {
          assert.ok(item[lang].title.trim());
          assert.ok(item[lang].body.trim());
        }
      }
      for (const slug of item.actions || (item.action ? [item.action] : []))
        assert.ok(data.action.some((a) => a.slug === slug));
      if (item.event) assert.ok(data.event.some((e) => e.slug === item.event));
      if (type === 'resource') {
        assert.ok(['official', 'neo', 'partner'].includes(item.source));
        assert.ok(item.url);
      }
      if (type === 'call') {
        assert.equal(item.timeZone, 'Europe/Brussels');
        assert.match(item.deadline, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      }
      assert.equal(item.status, undefined);
    }
  }
  const english = load(read('_site/en/news/index.html'));
  for (const item of data.news) {
    assert.equal(
      english(`main a[href="${publicPath(`/en/news/${item.slug}/`)}"]`).length,
      item.en ? 1 : 0
    );
  }
  assert.ok(!existsSync('_site/en/news/update-3/index.html'));
  assert.equal(
    load(read('_site/ka/news/update-3/index.html'))('header a[hreflang]').attr('href'),
    publicPath('/en/news/')
  );
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

test('wall-clock conversion handles DST transitions and rejects unsafe editor input', () => {
  const zone = 'Europe/Brussels';
  assert.equal(zonedDateTime('2026-12-15T17:00', zone), '2026-12-15T17:00:00+01:00');
  assert.equal(zonedDateTime('2026-06-15T17:00', zone), '2026-06-15T17:00:00+02:00');
  assert.equal(zonedDateTime('2026-03-29T01:30', zone), '2026-03-29T01:30:00+01:00');
  assert.equal(zonedDateTime('2026-03-29T03:30', zone), '2026-03-29T03:30:00+02:00');
  const call = {
    opens: '2026-03-29T01:30',
    deadline: '2026-03-29T03:30',
    timeZone: zone,
  };
  assert.equal(callStatus(call, new Date('2026-03-29T00:29:59Z')), 'upcoming');
  assert.equal(callStatus(call, new Date('2026-03-29T00:30Z')), 'open');
  assert.equal(callStatus(call, new Date('2026-03-29T01:30Z')), 'open');
  assert.equal(callStatus(call, new Date('2026-03-29T01:30:00.001Z')), 'closed');
  const event = { end: '2026-03-29T03:30', timeZone: zone };
  assert.equal(eventStatus(event, new Date('2026-03-29T01:30Z')), 'upcoming');
  assert.equal(eventStatus(event, new Date('2026-03-29T01:30:00.001Z')), 'past');
  assert.throws(() => zonedDateTime('2026-03-29T02:30', zone), /nonexistent/);
  assert.throws(() => zonedDateTime('2026-10-25T02:30', zone), /ambiguous/);
  assert.equal(zonedDateTime('2026-10-25T01:30', zone), '2026-10-25T01:30:00+02:00');
  assert.equal(zonedDateTime('2026-10-25T03:30', zone), '2026-10-25T03:30:00+01:00');
  assert.equal(
    zonedDateTime('2026-12-15T17:00', 'Asia/Tbilisi'),
    '2026-12-15T17:00:00+04:00'
  );
  for (const input of [
    '2026-12-15T17:00+01:00',
    '2026-12-15T17:00Z',
    '2026-02-30T17:00',
  ]) {
    assert.throws(() => zonedDateTime(input, zone), RangeError);
  }
  for (const invalidZone of [undefined, '', '+01:00', 'Not/AZone']) {
    assert.throws(() => zonedDateTime('2026-12-15T17:00', invalidZone), RangeError);
  }
});

test('stored call/event times are offset-free and output time elements have derived offsets', () => {
  const data = loadContent();
  for (const [type, fields] of [
    ['call', ['opens', 'deadline']],
    ['event', ['date', 'end']],
  ]) {
    for (const item of data[type]) {
      for (const field of fields) {
        assert.match(item[field], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        assert.ok(
          Number.isFinite(Date.parse(zonedDateTime(item[field], item.timeZone)))
        );
      }
    }
  }
  for (const file of files('_site').filter((f) => f.endsWith('.html'))) {
    const $ = load(read(file));
    for (const element of $('time')) {
      assert.match(
        $(element).attr('datetime'),
        /(?:^\d{4}-\d{2}-\d{2}$|Z$|[+-]\d{2}:\d{2}$)/
      );
    }
  }
});

test('selected call year is independent of the clock and precedes every archive year', () => {
  const selected = getSite().currentCallYear;
  assert.ok(Number.isInteger(selected));
  assert.deepEqual(
    callYears([{ year: 2027 }, { year: 2025 }, { year: 2027 }], 2026),
    [2026, 2027, 2025]
  );
  assert.deepEqual(callYears([], selected), [selected]);
  const data = loadContent();
  for (const lang of ['ka', 'en']) {
    const $ = load(read(`_site/${lang}/calls/index.html`));
    const years = $('[data-call-year]')
      .map((_, e) => Number($(e).attr('data-call-year')))
      .get();
    assert.deepEqual(years, callYears(data.call, selected));
    for (const year of years) {
      assert.equal(
        $(`[data-call-year="${year}"] time`).length,
        localise(data.call, lang).filter((item) => item.year === year).length
      );
    }
    const action = load(read(`_site/${lang}/opportunities/cbhe/index.html`));
    for (const item of data.call.filter((item) => item.action === 'cbhe')) {
      const time = zonedDateTime(item.deadline, item.timeZone);
      assert.equal(
        action(`time[datetime="${time}"]`).length,
        item.year === selected ? 1 : 0
      );
    }
  }
});

test('Pages output has a bilingual root 404 and a static home redirect', () => {
  assert.ok(existsSync('_site/.nojekyll'));
  assert.ok(!existsSync('_site/ka/404.html'));
  assert.ok(!existsSync('_site/en/404.html'));
  const $ = load(read('_site/404.html'));
  const ka = JSON.parse(read('src/_data/ka.json'));
  const en = JSON.parse(read('src/_data/en.json'));
  assert.equal($('h1').text(), ka.notFound);
  assert.equal($('section[lang=en] h2').text(), en.notFound);
  assert.ok($(`main a[href="${publicPath('/ka/')}"]`).length);
  assert.ok($(`main a[href="${publicPath('/en/')}"]`).length);
  assert.ok($('.eu-footer').text().includes(en.disclaimer));
  assert.match($('meta[name=robots]').attr('content'), /noindex/);
  const index = load(read('_site/index.html'));
  assert.equal(
    index('meta[http-equiv=refresh]').attr('content').replace(/\s/g, ''),
    `0;url=${publicPath('/ka/')}`
  );
  assert.equal(
    index('link[rel=canonical]').attr('href'),
    new URL('ka/', getSite().url).href
  );
  assert.ok(index(`main a[href="${publicPath('/ka/')}"]`).length);
});

test('unlaunched site blocks indexing on all pages and in robots.txt', () => {
  assert.equal(getSite().siteLaunched, false);
  for (const file of files('_site').filter((path) => path.endsWith('.html'))) {
    assert.match(load(read(file))('meta[name=robots]').attr('content'), /noindex/);
  }
  assert.match(read('_site/robots.txt'), /Disallow: \//);
});

test('home renders upcoming/open deadlines instead of rejecting every status', () => {
  for (const lang of ['ka', 'en']) {
    const expected = loadContent()
      .call.filter((item) => item[lang] && callStatus(item) !== 'closed')
      .sort(
        (a, b) =>
          Date.parse(zonedDateTime(a.deadline, a.timeZone)) -
          Date.parse(zonedDateTime(b.deadline, b.timeZone))
      )
      .slice(0, 3)
      .map((item) => zonedDateTime(item.deadline, item.timeZone));
    const $ = load(read(`_site/${lang}/index.html`));
    const dates = $('section[aria-labelledby="deadlines-title"] time')
      .map((_, element) => $(element).attr('datetime'))
      .get();
    assert.deepEqual(dates, expected);
  }
});
