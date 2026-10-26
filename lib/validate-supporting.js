import { basename } from 'node:path';
import { existsSync } from 'node:fs';
export const publicationTypes = ['neo-report', 'here-publication', 'brochure', 'statistics'];
export const faqTopics = ['applications', 'mobility'];
export function validateSupporting(item, type, file, actions) {
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
  if (type === 'publication') {
    if (!Number.isInteger(item.year) || item.year < 2014 || item.year > 2100) fail('year', 'use a year from 2014 to 2100');
    if (!publicationTypes.includes(item.type)) fail('type', 'unknown publication type');
    if (!['ka', 'en', 'ka/en'].includes(item.language)) fail('language', 'use ka, en or ka/en');
    if (typeof item.file !== 'string' || !/^\/assets\/publications\/[a-z0-9-]+\.(pdf|txt)$/i.test(item.file) || !existsSync(`src${item.file}`)) fail('file', 'use an existing local publication PDF or sample text file');
  }
  if (type === 'faq') {
    if (!faqTopics.includes(item.topic)) fail('topic', 'unknown FAQ topic');
    if (!Array.isArray(item.actions)) fail('actions', 'expected action slugs');
    for (const slug of item.actions) if (!actions.has(slug)) fail('actions', `unknown action: ${slug}`);
  }
  if (type === 'person' && !['neo', 'here'].includes(item.group)) fail('group', 'use neo or here');
}
