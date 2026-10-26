import { readdirSync, readFileSync } from 'node:fs';
export const types = ['action', 'call', 'event', 'resource', 'news', 'story', 'publication', 'faq', 'person', 'page'];
export function loadContent() {
  return Object.fromEntries(types.map(type => [type, readdirSync(`src/content/${type}`).filter(f => f.endsWith('.json')).map(file => JSON.parse(readFileSync(`src/content/${type}/${file}`, 'utf8')))]));
}
export function callStatus(item, now = new Date()) {
  if (now < new Date(item.opens)) return 'upcoming';
  return now <= new Date(item.deadline) ? 'open' : 'closed';
}
export function eventStatus(item, now = new Date()) {
  return now <= new Date(item.end) ? 'upcoming' : 'past';
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
