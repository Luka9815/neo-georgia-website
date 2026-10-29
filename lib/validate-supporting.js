import { basename } from 'node:path';
import { existsSync } from 'node:fs';
export const publicationTypes = ['neo-report', 'here-publication', 'brochure', 'statistics', 'report'];
export const faqTopics = ['applications', 'mobility'];
export function validateSupporting(item, type, file, actions, resolveTime) {
  const fail = (field, message) => { throw new Error(`${file}: ${field}: ${message}`); };
  const text = (value, field) => {
    if (typeof value !== 'string' || !value.trim()) fail(field, 'required non-empty text');
  };
  if (!item || typeof item !== 'object' || Array.isArray(item)) fail('$', 'expected an object');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || basename(file, '.json') !== item.slug) fail('slug', 'must match the ASCII filename');
  for (const lang of ['ka', 'en']) {
    text(item[lang]?.title, `${lang}.title`);
    text(item[lang]?.body, `${lang}.body`);
    if (type === 'person') text(item[lang]?.role, `${lang}.role`);
  }
  if (type === 'call') {
    if (item.opens === '') delete item.opens;
    if (!actions.has(item.action)) fail('action', 'use an existing Action slug');
    if (!Number.isInteger(item.year) || item.year < 2000 || item.year > 2100) fail('year', 'use a valid call year');
    if (item.timeZone !== 'Europe/Brussels') fail('timeZone', 'use Europe/Brussels');
    const times = {};
    for (const field of ['deadline', ...(item.opens == null ? [] : ['opens'])]) {
      try { times[field] = Date.parse(resolveTime(item[field], item.timeZone)); }
      catch (error) { fail(field, error.message); }
    }
    if (times.opens > times.deadline) fail('opens', 'must not follow the deadline');
    try { if (new URL(item.url).protocol !== 'https:') throw new Error(); }
    catch { fail('url', 'use a complete HTTPS official call URL'); }
  }
  if (type === 'publication') {
    if (!Number.isInteger(item.year) || item.year < 2014 || item.year > 2100) fail('year', 'use a year from 2014 to 2100');
    if (!publicationTypes.includes(item.type)) fail('type', 'unknown publication type');
    if (!['ka', 'en', 'ka/en'].includes(item.language)) fail('language', 'use ka, en or ka/en');
    if (item.url) {
      if (item.file) fail('file', 'use url or file, not both');
      try { if (new URL(item.url).protocol !== 'https:') throw new Error(); }
      catch { fail('url', 'use a complete HTTPS publication URL'); }
      text(item.publisher, 'publisher');
    } else if (typeof item.file !== 'string' || !/^\/assets\/publications\/[a-z0-9-]+\.pdf$/i.test(item.file) || !existsSync(`src${item.file}`)) fail('file', 'use an existing local publication file');
  }
  if (type === 'faq') {
    text(item.sourceUrl, 'sourceUrl');
    try { if (new URL(item.sourceUrl).protocol !== 'https:') throw new Error(); } catch { fail('sourceUrl','use a complete HTTPS source URL'); }
    if (!faqTopics.includes(item.topic)) fail('topic', 'unknown FAQ topic');
    if (!Array.isArray(item.actions)) fail('actions', 'expected action slugs');
    for (const slug of item.actions) if (!actions.has(slug)) fail('actions', `unknown action: ${slug}`);
  }
  if (type === 'person' && !Number.isInteger(item.order)) fail('order', 'use an integer');
  if (type === 'person' && !['neo', 'here'].includes(item.group)) fail('group', 'use neo or here');
  if (type === 'person' && item.roleBased) { text(item.officeKey || item.name, 'officeKey'); if (item.officeKey && !['coordinator','programmeOfficer','communicationsOfficer'].includes(item.officeKey)) fail('officeKey','use an existing office.team role'); if (!item.officeKey) text(item.roleEmail, 'roleEmail'); }
}
