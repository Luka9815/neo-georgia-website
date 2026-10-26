import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import MarkdownIt from 'markdown-it';
import {
  htmlToMarkdown,
  cleanUrl,
  romanise,
  uniqueSlug,
  plainText,
  convertPosts,
  suggestActions,
  eventCandidate,
} from '../scripts/wp/convert.js';
import { languageFindings } from '../scripts/wp/languages.js';

// Converter checks must stay offline even if a future helper changes.
const originalFetch = globalThis.fetch;
globalThis.fetch = () => {
  throw new Error('Network is forbidden in converter tests');
};
after(() => {
  globalThis.fetch = originalFetch;
});

const fixture = (name) =>
  readFileSync(new URL(`./fixtures/wp/${name}`, import.meta.url), 'utf8');
const run = {
  window: {
    startInclusive: '2025-10-26T12:00:00Z',
    endExclusive: '2026-10-26T12:00:00Z',
  },
  languages: { pairs: [] },
};
const post = (id, changes = {}) => ({
  id,
  slug: 'ძველი-სათაური',
  link: `https://erasmus.org.ge/?p=${id}`,
  date: '2026-06-15T14:00:00',
  date_gmt: '2026-06-15T10:00:00',
  title: { rendered: 'საინფორმაციო დღე' },
  content: { rendered: '<p>CBHE საინფორმაციო დღე 15 ივნისს.</p>' },
  categories: [],
  tags: [],
  ...changes,
});
function collections(posts, other = {}) {
  return {
    posts: { items: posts, complete: true },
    georgian: { items: posts, complete: true },
    english: { items: posts, complete: true },
    media: { items: [], complete: true },
    categories: { items: [], complete: true },
    tags: { items: [], complete: true },
    ...other,
  };
}

test('saved Elementor HTML becomes readable Markdown with links and lists', () => {
  const { markdown, warnings } = htmlToMarkdown(fixture('elementor-news.html'));
  assert.match(markdown, /^## საინფორმაციო დღე/m);
  assert.match(markdown, /\*\*CBHE\*\*/);
  assert.match(markdown, /\*პარტნიორები\*/);
  assert.match(markdown, /^-\s+პირველი ნაბიჯი/m);
  assert.match(markdown, /^1\.\s+შეავსეთ ფორმა/m);
  assert.ok(
    markdown.includes('(https://erasmus.org.ge/guide?id=12#eligibility)')
  );
  assert.ok(
    markdown.includes('(https://erasmus.org.ge/wp-content/uploads/agenda.pdf)')
  );
  assert.doesNotMatch(
    markdown,
    /vc_row|elementor|<script|window.bad|style=|utm_|fbclid/
  );
  assert.doesNotMatch(markdown, /\n{3}/);
  assert.ok(warnings.some((value) => /shortcode/.test(value)));
  const rendered = new MarkdownIt({ html: false }).render(markdown);
  assert.match(rendered, /<ul>/);
  assert.match(rendered, /<ol>/);
  assert.doesNotMatch(rendered, /<script|<iframe|<img/);
});

test('image variants and PDFs are inventoried with alt text but no embeds', () => {
  const { markdown, attachments } = htmlToMarkdown(
    fixture('elementor-news.html')
  );
  assert.doesNotMatch(markdown, /!\[/);
  assert.ok(markdown.includes('შეხვედრის მონაწილეები'));
  assert.ok(
    attachments.some(
      (a) => a.url.endsWith('/photo.jpg') && a.alt === 'მონაწილეები'
    )
  );
  assert.ok(attachments.some((a) => a.url.endsWith('/photo-150.jpg')));
  assert.ok(
    attachments.some((a) => a.type === 'pdf' && a.url.endsWith('/agenda.pdf'))
  );
});

test('contact redaction, table rows and lazy images survive cleanup safely', () => {
  const { markdown, warnings, attachments } = htmlToMarkdown(
    fixture('contact-and-table.html')
  );
  assert.doesNotMatch(markdown, /fixture@|%40|javascript:|mailto:|utm_|gclid/);
  assert.match(markdown, /Unsafe link label/);
  assert.match(markdown, /https:\/\/erasmus.org.ge\/apply\?call=2026/);
  assert.match(markdown, /https:\/\/example.org\/guide\?language=en/);
  assert.match(markdown, /CBHE \| \[Rules\]/);
  assert.ok(warnings.some((value) => /Email addresses redacted/.test(value)));
  assert.ok(warnings.some((value) => /Table/.test(value)));
  assert.ok(
    attachments.some(
      (a) => a.type === 'image' && a.url.endsWith('/image?id=123')
    )
  );
  assert.equal(
    plainText('<p>One</p><p>Two<br>Three</p><script>hidden</script>'),
    'One Two Three'
  );
});

test('URL cleanup drops tracking and unsafe schemes while preserving real parameters', () => {
  assert.equal(
    cleanUrl('/apply?utm_source=fb&call=2026&fbclid=x#form'),
    'https://erasmus.org.ge/apply?call=2026#form'
  );
  for (const value of [
    undefined,
    '',
    'mailto:fixture@example.invalid',
    'javascript:alert(1)',
    'data:image/png,x',
    'https://user:password@example.invalid/',
  ]) {
    assert.equal(cleanUrl(value), null);
  }
});

test('national romanisation covers the whole modern Georgian alphabet and Mtavruli', () => {
  assert.equal(
    romanise('აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ'),
    "abgdevztik'lmnop'zhrst'upkghq'shchtsdzts'ch'khjh"
  );
  assert.equal(romanise('ᲡᲐᲥᲐᲠᲗᲕᲔᲚᲝ'), 'sakartvelo');
  assert.equal(romanise('ჭიათურა, ყაზბეგი, ფოთი'), "ch'iatura, q'azbegi, poti");
});

test('slugs are ASCII, bounded, deterministic and unique after apostrophe removal', () => {
  const used = new Set(['sakartvelo']);
  assert.equal(uniqueSlug('საქართველო', 1, used), 'sakartvelo-2');
  assert.equal(uniqueSlug('ᲡᲐᲥᲐᲠᲗᲕᲔᲚᲝ', 2, used), 'sakartvelo-3');
  assert.equal(uniqueSlug('კარი', 3, used), 'kari');
  assert.equal(uniqueSlug('ქარი', 4, used), 'kari-2');
  assert.equal(
    uniqueSlug('  <b>Erasmus+</b> &amp; ჟან მონე 2026!  ', 5, used),
    'erasmus-zhan-mone-2026'
  );
  assert.equal(uniqueSlug('😃 中文', 42, used), 'news-42');
  const long = 'საერთაშორისო '.repeat(30);
  for (let id = 100; id < 115; id++) {
    const slug = uniqueSlug(long, id, used);
    assert.ok(slug.length <= 60);
    assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test('exact window includes the start, excludes the end and rejects missing GMT', () => {
  const records = [
    post(1, { date_gmt: '2025-10-26T12:00:00' }),
    post(2, { date_gmt: '2025-10-26T11:59:59' }),
    post(3, { date_gmt: '2026-10-26T12:00:00' }),
    post(4, { date_gmt: '2026-10-26T11:59:59' }),
    post(5, { date_gmt: '' }),
  ];
  const { results } = convertPosts(collections(records), run);
  assert.deepEqual(
    results.map((row) => row.id),
    [1, 4, 5]
  );
  assert.equal(results[2].status, 'failed');
  assert.match(results[2].warnings[0], /date_gmt/);
  assert.equal(results[0].news.date, '2026-06-15');
});

test('only verified English relations create en and repeated lang queries do not', () => {
  const ka = post(1, { lang: 'ka', translations: { ka: 1, en: 2 } });
  const en = post(2, {
    lang: 'en',
    title: { rendered: 'Information day' },
    content: { rendered: '<p>English information day for CBHE.</p>' },
    translations: { ka: 1, en: 2 },
  });
  const c = collections([ka], { english: { items: [en], complete: true } });
  const findings = languageFindings(c);
  const converted = convertPosts(c, { ...run, languages: findings });
  assert.equal(findings.pairs.length, 1);
  assert.equal(converted.results[0].news.en.title, 'Information day');
  assert.equal(converted.results[0].news.legacy.en.id, 2);
  const noMetadata = collections([post(3)]);
  const ignoredQuery = languageFindings(noMetadata);
  assert.equal(ignoredQuery.englishQuery.sameIdsAsDefault, true);
  assert.equal(ignoredQuery.pairs.length, 0);
  assert.equal(
    convertPosts(noMetadata, { ...run, languages: ignoredQuery }).results[0]
      .news.en,
    undefined
  );
  const repeated = collections([ka, { ...ka, id: 2, lang: 'en' }]);
  assert.equal(languageFindings(repeated).pairs.length, 0);
});

test('Action evidence is suggested, empty matches stay empty, Events stay News-shaped', () => {
  const p = post(1, { categories: [7], tags: [8] });
  const suggestions = suggestActions(
    p,
    [{ id: 7, name: 'Erasmus Mundus' }],
    [{ id: 8, name: 'Virtual Exchanges' }]
  );
  assert.deepEqual(suggestions.map((s) => s.slug).sort(), [
    'cbhe',
    'erasmus-mundus',
    'virtual-exchanges',
  ]);
  assert.ok(
    suggestions.every((s) => s.status === 'suggested' && s.evidence.length)
  );
  const matched = convertPosts(collections([p]), run).results[0].news;
  assert.equal(matched.migration.typeCandidate.type, 'event');
  assert.equal(matched.end, undefined);
  const empty = post(2, { content: { rendered: '<p>ოფისის განცხადება.</p>' } });
  const unmatched = convertPosts(collections([empty]), run).results[0].news;
  assert.deepEqual(unmatched.actions, []);
  assert.ok(
    unmatched.migration.warnings.some((w) =>
      /must select a real Action/.test(w)
    )
  );
  assert.equal(eventCandidate('A webinar with no stated day').type, 'news');
});

test('media metadata keeps known sizes, gallery/featured usage and duplicates for review', () => {
  const p = post(1, {
    featured_media: 9,
    content: { rendered: '<p>განცხადება CBHE.</p>[gallery ids="9,10"]' },
  });
  const media = {
    items: [
      {
        id: 9,
        source_url: 'https://erasmus.org.ge/photo.jpg',
        mime_type: 'image/jpeg',
        alt_text: 'ხედი',
        filesize: 1200,
      },
      {
        id: 10,
        source_url: 'https://erasmus.org.ge/second.jpg',
        mime_type: 'image/jpeg',
      },
    ],
  };
  const result = convertPosts(
    collections([p, { ...p, id: 2 }], { media }),
    run
  );
  const asset = result.results[0].attachments.find((a) => a.mediaId === 9);
  assert.equal(asset.sizeBytes, 1200);
  assert.equal(asset.alt, 'ხედი');
  assert.deepEqual(asset.usedBy, [1]);
  assert.ok(asset.uses.some((use) => use.relationship === 'gallery-shortcode'));
  assert.ok(asset.uses.some((use) => use.relationship === 'featured-image'));
  assert.ok(result.duplicates.some((group) => group.field === 'body'));
  assert.notEqual(result.results[0].slug, result.results[1].slug);
});
