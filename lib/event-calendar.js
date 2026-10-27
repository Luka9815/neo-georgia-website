import { Temporal } from '@js-temporal/polyfill';
import { zonedDateTime } from './content.js';
import { absoluteUrl } from './urls.js';

// UTC values are resolved from each editor-entered named zone, never the host zone.
function instant(value, timeZone) {
  return new Date(zonedDateTime(value, timeZone));
}
function utc(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
function text(value) {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;').replace(/,/g, '\\,');
}
// RFC 5545 folds at 75 octets, keeping UTF-8 characters intact.
function fold(line) {
  const lines = [];
  let current = '';
  for (const character of line) {
    if (Buffer.byteLength(current + character, 'utf8') > 75) {
      lines.push(current);
      current = ' ';
    }
    current += character;
  }
  return [...lines, current].join('\r\n');
}

export function eventIcs(events, lang, baseUrl, now = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NEO Georgia//Events//EN', 'CALSCALE:GREGORIAN'];
  for (const item of events) {
    const start = instant(item.date, item.timeZone);
    const end = instant(item.end, item.timeZone);
    if (end < start) throw new RangeError(`Event ${item.slug}: end precedes start`);
    lines.push(
      'BEGIN:VEVENT',
      `UID:neo-georgia-event-${item.slug}`,
      `DTSTAMP:${utc(now)}`,
      `DTSTART:${utc(start)}`,
    );
    // RFC 5545 requires DTEND to be strictly later than DTSTART when present.
    if (end > start) lines.push(`DTEND:${utc(end)}`);
    lines.push(
      `SUMMARY;LANGUAGE=${lang}:${text(item[lang].title)}`,
      `DESCRIPTION;LANGUAGE=${lang}:${text(item[lang].body)}`,
      `LOCATION;LANGUAGE=${lang}:${text(item[lang].venue)}`,
      `URL:${absoluteUrl(`/${lang}/events/${item.slug}/`, baseUrl)}`,
      'END:VEVENT',
    );
  }
  return [...lines, 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
}

function lastDay(item) {
  let end = Temporal.PlainDate.from(item.end.slice(0, 10));
  // A midnight end is exclusive, except for a zero-duration Event.
  if (item.end.endsWith('T00:00') && item.end > item.date) end = end.subtract({ days: 1 });
  return end;
}

export function calendarMonths(events, currentDate = Temporal.Now.plainDateISO('Asia/Tbilisi').toString()) {
  const months = new Set([currentDate.slice(0, 7)]);
  for (const item of events) {
    const end = lastDay(item).toString().slice(0, 7);
    let month = Temporal.PlainYearMonth.from(item.date.slice(0, 7));
    while (month.toString() <= end) {
      months.add(month.toString());
      month = month.add({ months: 1 });
    }
  }
  return [...months].sort().map(key => {
    const first = Temporal.PlainDate.from(`${key}-01`);
    const days = Array.from({ length: first.daysInMonth }, (_, index) => {
      const date = first.add({ days: index });
      const value = date.toString();
      return {
        date: value, day: date.day,
        events: events.filter(item => item.date.slice(0, 10) <= value && lastDay(item).toString() >= value)
          .sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug)),
      };
    });
    const cells = [...Array(first.dayOfWeek - 1).fill(null), ...days];
    while (cells.length % 7) cells.push(null);
    return {
      key, year: first.year, month: first.month,
      weeks: Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7)),
    };
  });
}
