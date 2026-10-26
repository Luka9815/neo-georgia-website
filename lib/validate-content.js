import { basename } from 'node:path';

export const eventOptions = {
  timeZone: ['Asia/Tbilisi', 'Europe/Brussels'],
  type: ['information-day', 'webinar', 'training', 'conference', 'erasmus-days'],
  format: ['online', 'in-person', 'hybrid'],
  organiser: ['neo', 'eacea', 'partner'],
};

export function validateEntry(item, type, file, actionSlugs, resolveTime) {
  const fail = (field, message) => {
    throw new Error(`${file}: ${field}: ${message}`);
  };
  const text = (object, field, path = field) => {
    if (typeof object?.[field] !== 'string' || !object[field].trim()) {
      fail(path, 'required non-empty text');
    }
  };
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    fail('$', 'expected a JSON object');
  }
  text(item, 'slug');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
    fail('slug', 'use lowercase ASCII letters, numbers and single hyphens');
  }
  if (basename(file, '.json') !== item.slug) {
    fail(
      'slug',
      'must match the filename; ask the technical contact to rename a published item'
    );
  }
  if (!Array.isArray(item.actions) || !item.actions.length) {
    fail('actions', 'select at least one existing action');
  }
  item.actions.forEach((slug, index) => {
    if (!actionSlugs.has(slug))
      fail(`actions[${index}]`, `unknown action slug: ${slug}`);
  });
  const languages = type === 'event' ? ['ka', 'en'] : ['ka'];
  // CMS optional objects may arrive empty. They must not create English routes.
  if (type === 'news' && item.en != null) {
    if (typeof item.en !== 'object' || Array.isArray(item.en)) {
      fail('en', 'expected an object or omit the translation');
    }
    if (Object.values(item.en).some((value) => String(value ?? '').trim()))
      languages.push('en');
    else delete item.en;
  } else if (type === 'news') {
    delete item.en;
  }
  for (const lang of languages) {
    text(item[lang], 'title', `${lang}.title`);
    text(item[lang], 'body', `${lang}.body`);
    if (type === 'event') {
      text(item[lang], 'venue', `${lang}.venue`);
      if (item[lang].agenda != null && typeof item[lang].agenda !== 'string') {
        fail(`${lang}.agenda`, 'expected optional text');
      }
    }
  }
  if (type === 'news') {
    if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
      fail('date', 'use YYYY-MM-DD without a time or UTC offset');
    }
    try {
      resolveTime(`${item.date}T00:00`, 'UTC');
    } catch {
      fail('date', 'invalid calendar date');
    }
    return;
  }
  for (const [field, values] of Object.entries(eventOptions)) {
    if (!values.includes(item[field]))
      fail(field, `select one of: ${values.join(', ')}`);
  }
  const instants = {};
  for (const field of ['date', 'end']) {
    try {
      instants[field] = Date.parse(resolveTime(item[field], item.timeZone));
    } catch (error) {
      fail(field, error.message);
    }
  }
  if (instants.end < instants.date)
    fail('end', 'must not be before date in the selected time zone');
  if (item.registration == null || item.registration === '') return;
  if (typeof item.registration !== 'string') fail('registration', 'expected an optional HTTPS URL');
  if (!item.registration.trim()) return;
  try {
    if (new URL(item.registration).protocol !== 'https:') throw new Error();
  } catch {
    fail('registration', 'use a complete HTTPS registration URL');
  }
}
