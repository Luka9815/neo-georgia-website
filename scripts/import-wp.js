#!/usr/bin/env node
// Manual dry run only. Nothing here is imported by the site build or tests.
import { mkdirSync, writeFileSync, existsSync, realpathSync, readdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Temporal } from '@js-temporal/polyfill';
import { createClient, oldSite } from './wp/client.js';
import { languageFindings, translationIds } from './wp/languages.js';
import { convertPosts } from './wp/convert.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const reviewDirectory = join(root, 'migration/review');

export function writeReview(path, data) {
  const target = resolve(reviewDirectory, path);
  if (!target.startsWith(reviewDirectory + '/')) throw new Error('Output must stay in migration/review/');
  // Refuse symlinked directories so review output cannot reach src/content/.
  let directory = dirname(target);
  while (directory.startsWith(root)) {
    if (existsSync(directory) && realpathSync(directory) !== directory) {
      throw new Error(`Refusing symlinked output directory: ${directory}`);
    }
    directory = dirname(directory);
  }
  if (existsSync(target) && realpathSync(target) !== target) throw new Error('Refusing symlinked output file');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
}

async function main() {
  if (process.env.CI) throw new Error('The WordPress importer is manual only; do not run it in CI.');
  const args = process.argv.slice(2);
  if (args.length && !(args.length === 2 && args[0] === '--run-at')) {
    throw new Error('Usage: node --use-env-proxy scripts/import-wp.js [--run-at UTC-ISO-INSTANT]');
  }
  const startedAt = new Date().toISOString();
  const end = Temporal.Instant.from(args[1] || startedAt);
  const start = end.toZonedDateTimeISO('UTC').subtract({ months: 12 }).toInstant();
  const run = {
    source: oldSite,
    mode: 'DRY RUN: review files only, not publication',
    startedAt,
    runDate: end.toString().slice(0, 10),
    window: { startInclusive: start.toString(), endExclusive: end.toString(), basis: 'Publication date_gmt; twelve calendar months in UTC' },
    runAtOverride: args[1] || null,
    requests: [],
    collections: {},
    failures: [],
  };
  const client = createClient(run.requests);
  const params = {
    status: 'publish', orderby: 'id', order: 'asc',
    // WP installations interpret after/before in their local zone. Fetch a
    // two-day cushion, then use date_gmt for the exact window in conversion.
    after: start.subtract({ hours: 48 }).toString(),
    before: end.add({ hours: 48 }).toString(),
  };
  const collections = {};
  for (const [name, resource, query] of [
    ['posts', 'posts', params],
    ['georgian', 'posts', { ...params, lang: 'ka' }],
    ['english', 'posts', { ...params, lang: 'en' }],
    ['categories', 'categories', { hide_empty: false }],
    ['tags', 'tags', { hide_empty: false }],
    ['media', 'media', { orderby: 'id', order: 'asc' }],
  ]) {
    console.log(`Reading ${name}...`);
    collections[name] = await client.collection(resource, query);
  }
  const all = [...collections.posts.items, ...collections.georgian.items, ...collections.english.items];
  const known = new Set(all.map((post) => post.id));
  const missing = [...new Set(all.flatMap((post) => Object.values(translationIds(post))))]
    .filter((id) => !known.has(id));
  collections.translationLookup = { items: [], complete: true };
  for (let index = 0; index < missing.length; index += 100) {
    const result = await client.collection('posts', { include: missing.slice(index, index + 100).join(',') });
    collections.translationLookup.items.push(...result.items);
    if (!result.complete) {
      collections.translationLookup.complete = false;
      collections.translationLookup.error = result.error;
    }
  }
  for (const [name, result] of Object.entries(collections)) {
    run.collections[name] = { count: result.items.length, complete: result.complete, expectedTotal: result.expectedTotal };
    if (result.error) run.failures.push({ collection: name, message: result.error });
  }
  run.languages = languageFindings(collections);
  const reserved = readdirSync(join(root, 'src/content/news'))
    .filter((file) => file.endsWith('.json')).map((file) => file.slice(0, -5));
  const converted = convertPosts(collections, run, reserved);
  // Remove only our previous generated News files after collecting the new run.
  const newsDirectory = join(reviewDirectory, 'news');
  mkdirSync(newsDirectory, { recursive: true });
  if (realpathSync(newsDirectory) !== newsDirectory) throw new Error('Refusing symlinked News output');
  for (const file of readdirSync(newsDirectory).filter((name) => name.endsWith('.json'))) {
    unlinkSync(join(newsDirectory, file));
  }
  for (const row of converted.results) {
    if (row.news) writeReview(`news/${row.slug}.json`, row.news);
  }
  const inventory = {
    items: converted.results.map(({ news, ...row }) => row),
    duplicates: converted.duplicates,
  };
  writeReview('inventory.json', inventory);
  run.counts = {
    inWindow: inventory.items.length,
    convertedNews: converted.results.filter((row) => row.news).length,
    withEnglish: converted.results.filter((row) => row.news?.en).length,
    eventCandidates: inventory.items.filter((row) => row.typeCandidate?.type === 'event').length,
    failedConversions: inventory.items.filter((row) => row.status === 'failed').length,
  };
  run.finishedAt = new Date().toISOString();
  writeReview('run.json', run);
  // Local recovery snapshot, deliberately ignored by git. Only sanitised review
  // files should be committed; public source HTML may contain personal emails.
  writeReview('.cache/source.json', collections);
  console.log(`Recorded ${run.failures.length} failed collection(s). Output: migration/review/`);
  if (run.failures.length || run.counts.failedConversions) process.exitCode = 1;
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
