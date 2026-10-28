import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateEntry } from './validate-content.js';
import { validateSupporting } from './validate-supporting.js';
import { Temporal } from '@js-temporal/polyfill';
export const types = [
  'action',
  'call',
  'event',
  'resource',
  'news',
  'story',
  'publication',
  'faq',
  'person',
  'page',
];
export function loadContent(root = 'src/content') {
  const records = {};
  for (const type of types) {
    records[type] = readdirSync(join(root, type))
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const path = join(root, type, file);
        try {
          return { file: path, item: JSON.parse(readFileSync(path, 'utf8')) };
        } catch (cause) {
          throw new Error(`${path}: $: invalid JSON (${cause.message})`, { cause });
        }
      });
  }
  const actions = new Set(records.action.map(({ item }) => item.slug));
  for (const type of ['news', 'event']) {
    for (const { file, item } of records[type]) {
      validateEntry(item, type, file, actions, zonedDateTime);
    }
  }
  for (const type of ['publication', 'faq', 'person']) {
    for (const { file, item } of records[type]) validateSupporting(item, type, file, actions);
  }
  return Object.fromEntries(
    types.map((type) => [type, records[type].map((r) => r.item)])
  );
}
// Resolve editor-entered wall-clock times without relying on the machine's zone.
export function zonedDateTime(value, timeZone) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new RangeError(
      'Use a local date and time in YYYY-MM-DDTHH:mm format without an offset.'
    );
  }
  if (typeof timeZone !== 'string' || !timeZone || /^[+-]/.test(timeZone)) {
    throw new RangeError('A named IANA timeZone is required.');
  }
  try {
    return Temporal.PlainDateTime.from(value)
      .toZonedDateTime(timeZone, { disambiguation: 'reject' })
      .toString({ timeZoneName: 'never', smallestUnit: 'second' });
  } catch (cause) {
    throw new RangeError(
      `Invalid, ambiguous or nonexistent local time: ${value} in ${timeZone}. ` +
        'Use a valid, unambiguous time and named IANA time zone.',
      { cause }
    );
  }
}
export function callStatus(item, now = new Date()) {
  const opens = item.opens ? new Date(zonedDateTime(item.opens, item.timeZone)) : null;
  const deadline = new Date(zonedDateTime(item.deadline, item.timeZone));
  if (opens && now < opens) return 'upcoming';
  return now <= deadline ? 'open' : 'closed';
}
export function eventStatus(item, now = new Date()) {
  return now <= new Date(zonedDateTime(item.end, item.timeZone)) ? 'upcoming' : 'past';
}
export function localise(items, lang) {
  return items.filter((item) => item[lang]).map((item) => ({ ...item, ...item[lang] }));
}
export function related(items, slug) {
  return items.filter((item) => item.action === slug || item.actions?.includes(slug));
}
export function dateLabel(value, strings, zone = 'Europe/Brussels', time = true) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(value))
      .map((p) => [p.type, p.value])
  );
  const date = `${Number(parts.day)} ${strings.months[Number(parts.month) - 1]} ${parts.year}`;
  return time ? `${date}, ${parts.hour}:${parts.minute}` : date;
}

// Keep the selected edition first even when it has no calls yet.
export function callYears(items, currentCallYear) {
  const archive = [...new Set(items.map((item) => item.year))]
    .filter((year) => year !== currentCallYear)
    .sort((a, b) => b - a);
  return [currentCallYear, ...archive];
}
