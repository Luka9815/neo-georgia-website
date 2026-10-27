import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { calendarMonths, eventIcs } from '../lib/event-calendar.js';
import { loadContent, eventStatus } from '../lib/content.js';
import { getPathPrefix } from '../lib/urls.js';

const now = new Date('2026-10-27T10:00:00Z');
const base = 'https://example.org/site/';
const fixture = (date, end, timeZone = 'Europe/Brussels') => ({
  slug: 'dst-event', date, end, timeZone,
  ka: { title: 'საცდელი ღონისძიება', venue: 'თბილისი; ბრიუსელი', body: 'ტექსტი, ახალი\nსტრიქონი\\დასასრული'.repeat(8) },
  en: { title: 'Test event', venue: 'Tbilisi; Brussels', body: 'Text, new\nline\\end'.repeat(8) },
});
const unfold = value => value.replace(/\r\n /g, '');

for (const lang of ['ka', 'en']) {
  test(`ICS resolves spring/autumn DST boundaries and rejects ambiguous/nonexistent times (${lang})`, () => {
    for (const [date, end, startUtc, endUtc] of [
      ['2026-03-29T01:30', '2026-03-29T03:30', '20260329T003000Z', '20260329T013000Z'],
      ['2026-10-25T01:30', '2026-10-25T03:30', '20261024T233000Z', '20261025T023000Z'],
    ]) {
      const ics = unfold(eventIcs([fixture(date, end)], lang, base, now));
      assert.ok(ics.includes(`DTSTART:${startUtc}\r\n`));
      assert.ok(ics.includes(`DTEND:${endUtc}\r\n`));
      assert.ok(ics.includes(`SUMMARY;LANGUAGE=${lang}:${fixture(date, end)[lang].title}`));
    }
    for (const date of ['2026-03-29T02:30', '2026-10-25T02:30']) {
      assert.throws(() => eventIcs([fixture(date, date)], lang, base, now), /ambiguous or nonexistent/);
    }
    const georgia = unfold(eventIcs([fixture('2026-03-29T10:00', '2026-03-29T11:00', 'Asia/Tbilisi')], lang, base, now));
    assert.ok(georgia.includes('DTSTART:20260329T060000Z'));
  });

  test(`ICS is RFC-shaped with stable slug UID, CRLF, escaped text and UTF-8 folding (${lang})`, () => {
    const item = fixture('2026-11-01T10:00', '2026-11-01T10:00');
    const body = eventIcs([item], lang, base, now);
    assert.ok(body.endsWith('END:VCALENDAR\r\n'));
    assert.doesNotMatch(body.replaceAll('\r\n', ''), /[\r\n]/);
    for (const line of body.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
    assert.doesNotMatch(body, /�/);
    const unfolded = unfold(body);
    assert.ok(unfolded.includes('DTSTAMP:20261027T100000Z'));
    assert.ok(unfolded.includes(`URL:${base}${lang}/events/dst-event/`));
    assert.ok(unfolded.includes(`LOCATION;LANGUAGE=${lang}:${item[lang].venue.replace(';', '\\;')}`));
    assert.ok(unfolded.includes('\\n') && unfolded.includes('\\,') && unfolded.includes('\\\\'));
    assert.doesNotMatch(body, /DTEND:/);
    const uid = value => value.match(/^UID:(.+)$/m)[1];
    assert.equal(uid(body), uid(eventIcs([{ ...item, date: '2027-07-01T10:00', end: '2027-07-01T11:00' }], lang === 'ka' ? 'en' : 'ka', 'https://other.example/', new Date())));
    assert.throws(() => eventIcs([{ ...item, end: '2026-11-01T09:00' }], lang, base), /end precedes start/);
  });
}

test('month tables handle Monday offsets, leap days, empty months and exclusive midnight ends', () => {
  const spanning = fixture('2028-02-28T10:00', '2028-03-01T00:00');
  const months = calendarMonths([spanning], '2028-04-01');
  assert.deepEqual(months.map(month => month.key), ['2028-02', '2028-04']);
  const february = months[0].weeks.flat().filter(Boolean);
  assert.equal(february.length, 29);
  assert.equal(months[0].weeks[0][0], null); // 1 February 2028 is Tuesday.
  assert.deepEqual(february.filter(day => day.events.length).map(day => day.day), [28, 29]);
  assert.equal(months[1].weeks.flat().filter(Boolean).flatMap(day => day.events).length, 0);
  const crossing = calendarMonths([fixture('2026-12-31T22:00', '2027-01-02T10:00')], '2026-12-01');
  assert.deepEqual(crossing.map(month => month.key), ['2026-12', '2027-01']);
  assert.deepEqual(crossing[1].weeks.flat().filter(day => day?.events.length).map(day => day.day), [1, 2]);
});

test('generated bilingual calendar has semantic weekdays, month anchors, list fallback and static ICS links', () => {
  const events = loadContent().event;
  for (const lang of ['ka', 'en']) {
    const strings = JSON.parse(readFileSync(`src/_data/${lang}.json`));
    const $ = load(readFileSync(`_site/${lang}/events/calendar/index.html`, 'utf8'));
    assert.ok($('.event-calendar').length);
    assert.deepEqual($('.event-calendar').first().find('thead th').map((_, el) => $(el).text()).get(), strings.weekdays);
    assert.equal($('.event-calendar th:not([scope=col])').length, 0);
    assert.ok($('.calendar-scroll[tabindex="0"][role=region]').length);
    assert.ok($(`main a[href="${getPathPrefix()}${lang}/events/"]`).length);
    for (const anchor of $('.calendar-month-links a')) assert.equal($(anchor.attribs.href).length, 1);
    for (const item of events) {
      const file = readFileSync(`_site/${lang}/events/${item.slug}/event.ics`, 'utf8');
      assert.ok(unfold(file).includes(`SUMMARY;LANGUAGE=${lang}:${item[lang].title}`));
      const detail = load(readFileSync(`_site/${lang}/events/${item.slug}/index.html`, 'utf8'));
      assert.equal(detail(`a[href="${getPathPrefix()}${lang}/events/${item.slug}/event.ics"][download]`).length, 1);
    }
    const feed = readFileSync(`_site/${lang}/events/upcoming.ics`, 'utf8');
    for (const item of events) assert.equal(feed.includes(`UID:neo-georgia-event-${item.slug}@`), eventStatus(item) === 'upcoming');
  }
});
