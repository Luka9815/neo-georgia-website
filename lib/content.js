import { readdirSync, readFileSync } from 'node:fs';
import { Temporal } from '@js-temporal/polyfill';
export const types = ['action', 'call', 'event', 'resource', 'news', 'story', 'publication', 'faq', 'person', 'page'];
export function loadContent() {
  return Object.fromEntries(types.map(type => [type, readdirSync(`src/content/${type}`).filter(f => f.endsWith('.json')).map(file => JSON.parse(readFileSync(`src/content/${type}/${file}`, 'utf8')))]));
}
// Resolve editor-entered wall-clock times without relying on the machine's zone.
export function zonedDateTime(value, timeZone) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new RangeError('Use a local date and time in YYYY-MM-DDTHH:mm format without an offset.');
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
  const opens = new Date(zonedDateTime(item.opens, item.timeZone));
  const deadline = new Date(zonedDateTime(item.deadline, item.timeZone));
  if (now < opens) return 'upcoming';
  return now <= deadline ? 'open' : 'closed';
}
export function eventStatus(item, now = new Date()) {
  return now <= new Date(zonedDateTime(item.end, item.timeZone)) ? 'upcoming' : 'past';
}
export function localise(items, lang) {
  return items.filter(item => item[lang]).map(item => ({ ...item, ...item[lang] }));
}
export function related(items, slug) {
  return items.filter(item => item.action === slug || item.actions?.includes(slug));
}
export function dateLabel(value, strings, zone = 'Europe/Brussels', time = true) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(value)).map(p => [p.type, p.value]));
  return `${Number(parts.day)} ${strings.months[Number(parts.month) - 1]} ${parts.year}${time ? `, ${parts.hour}:${parts.minute}` : ''}`;
}
