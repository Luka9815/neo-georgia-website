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
  cleanTitle,
  cleanThemeMarkdown,
} from '../scripts/wp/convert.js';
import {
  detectTextLanguage,
  postLanguage,
} from '../scripts/wp/language-review.js';
import {
  selectReviewImage,
  imageDimensions,
  downloadReviewImages,
} from '../scripts/wp/images.js';
import { renderReport, renderDecisions } from '../scripts/wp/report.js';
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

test('even explicit English relations remain candidates and source records are not merged', () => {
  const ka = post(1, { lang: 'ka', translations: { ka: 1, en: 2 } });
  const en = post(2, {
    lang: 'en',
    title: { rendered: 'Information day' },
    content: { rendered: fixture('english-source.html') },
    translations: { ka: 1, en: 2 },
  });
  const c = collections([ka], { english: { items: [en], complete: true } });
  const findings = languageFindings(c);
  const converted = convertPosts(c, { ...run, languages: findings });
  assert.equal(converted.results.length, 2);
  assert.equal(converted.results[0].news.en, undefined);
  assert.equal(converted.results[0].news.legacy.id, 1);
  assert.equal(converted.results[1].news.en.title, 'Information day');
  assert.equal(converted.results[1].news.ka, undefined);
  assert.equal(converted.results[1].news.legacy.id, 2);
  const pair = converted.pairCandidates.find(
    (pair) => pair.kind === 'cross-post'
  );
  assert.equal(pair.status, 'CANDIDATE');
  assert.equal(pair.confidence, 'high');
  const noMetadata = collections([post(3)]);
  const ignoredQuery = languageFindings(noMetadata);
  assert.equal(ignoredQuery.englishQuery.sameIdsAsDefault, true);
  assert.equal(ignoredQuery.pairs.length, 0);
  assert.equal(
    convertPosts(noMetadata, { ...run, languages: ignoredQuery }).results[0]
      .news.en,
    undefined
  );
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

test('title/body detection keeps mixed bodies outside ka and ignores URL letters', () => {
  const bilingual = post(1, {
    content: { rendered: fixture('bilingual-source.html') },
  });
  const profile = postLanguage(bilingual);
  assert.equal(profile.title.script, 'georgian');
  assert.equal(profile.body.script, 'mixed');
  assert.equal(profile.englishMarker, true);
  const converted = convertPosts(collections([bilingual]), run);
  const draft = converted.results[0].news;
  assert.equal(draft.ka, undefined);
  assert.equal(draft.en, undefined);
  assert.ok(draft.sourceText.body.includes('The information day'));
  assert.equal(converted.pairCandidates[0].kind, 'within-post');
  assert.equal(converted.pairCandidates[0].status, 'CANDIDATE');
  assert.equal(
    detectTextLanguage(
      '<p>ქართული საინფორმაციო ტექსტი.</p><a>https://example.invalid/long-latin-url-for-the-article</a>'
    ).script,
    'georgian'
  );
});

test('pure English bodies with Georgian titles are flagged separately, not called Georgian', () => {
  const record = post(1, {
    content: { rendered: fixture('english-source.html') },
  });
  const { results, englishWithoutCandidate } = convertPosts(
    collections([record]),
    run
  );
  assert.equal(results[0].language.title.script, 'georgian');
  assert.equal(results[0].language.body.language, 'en-candidate');
  assert.equal(results[0].news.ka, undefined);
  assert.ok(results[0].news.sourceText.body.startsWith('The information day'));
  assert.deepEqual(englishWithoutCandidate, [1]);
});

test('date proximity needs topic/media/slug evidence and never merges candidates', () => {
  const ka = post(1, { featured_media: 99 });
  const en = post(2, {
    date: '2026-06-16T14:00:00',
    featured_media: 99,
    title: { rendered: 'Information day' },
    content: { rendered: fixture('english-source.html') },
  });
  const media = {
    items: [
      {
        id: 99,
        source_url: 'https://erasmus.org.ge/photo.jpg',
        mime_type: 'image/jpeg',
      },
    ],
  };
  const converted = convertPosts(collections([ka, en], { media }), run);
  assert.equal(converted.results.length, 2);
  const pair = converted.pairCandidates.find(
    (pair) => pair.kind === 'cross-post'
  );
  assert.equal(pair.status, 'CANDIDATE');
  assert.ok(pair.evidence.some((value) => value.includes('1 day')));
  assert.ok(
    pair.evidence.some((value) => value.includes('shared image/media'))
  );
  const unrelated = post(3, {
    slug: 'office-opening-hours',
    title: { rendered: 'Office opening hours' },
    content: {
      rendered:
        '<p>The office is open for visitors and the public on Mondays in the afternoon.</p>',
    },
  });
  assert.equal(
    convertPosts(collections([ka, unrelated]), run).pairCandidates.length,
    0
  );
});

test('theme cleanup removes leading dates and empty info markers, preserving meaningful body emoji', () => {
  const { markdown } = htmlToMarkdown(fixture('theme-debris.html'));
  assert.doesNotMatch(markdown, /03\.11\.2025/);
  assert.ok(markdown.startsWith('📣 მთავარი ინფორმაცია'));
  assert.match(markdown, /\*\*ℹ️\*\* მნიშვნელოვანი/);
  assert.match(markdown, /\{15\.12\.2025\}/);
  assert.doesNotMatch(markdown, /\n\s*\n\s*\n/);
  assert.equal(
    cleanThemeMarkdown('{01.02.2026}\n\n**ℹ️**\n\nText\n\n\n'),
    'Text'
  );
  assert.equal(cleanTitle('👩🏽‍🎓 📣 10 ოქტომბერი'), '10 ოქტომბერი');
  assert.equal(cleanTitle('🇬🇪 NEO Georgia'), 'NEO Georgia');
  assert.equal(cleanTitle('2026 წლის სიახლეები 📣'), '2026 წლის სიახლეები 📣');
});

test('clean legacy slugs take precedence and romanised fallback truncates whole words', () => {
  const used = new Set();
  assert.equal(
    uniqueSlug('ქართული სათაური', 1, used, 'legacy_news-2026'),
    'legacy-news-2026'
  );
  assert.equal(
    uniqueSlug('სხვა სათაური', 2, used, 'legacy_news-2026'),
    'legacy-news-2026-2'
  );
  assert.equal(uniqueSlug('საქართველო', 3, used, '%E1%83%A5'), 'sakartvelo');
  assert.equal(uniqueSlug('საქართველო', 4, used, 'Not-Clean'), 'sakartvelo-2');
  const title = 'საერთაშორისო '.repeat(10);
  const fallback = uniqueSlug(title, 5, used, 'ძველი-სათაური');
  assert.ok(fallback.length <= 60);
  assert.ok(fallback.endsWith('saertashoriso'));
  assert.equal(
    uniqueSlug(
      'სათაური',
      6,
      used,
      'a-long-clean-legacy-slug-'.repeat(4) + 'end'
    ),
    'a-long-clean-legacy-slug-'.repeat(4) + 'end'
  );
});

test('image selection chooses the largest eligible variant and skips HEIC/oversized sources', () => {
  const media = [
    {
      id: 9,
      post: 1,
      mime_type: 'image/png',
      source_url: 'https://erasmus.org.ge/full.png',
      media_details: {
        width: 2048,
        height: 1500,
        sizes: {
          medium: {
            source_url: 'https://erasmus.org.ge/medium.jpg',
            width: 300,
            height: 200,
          },
          large: {
            source_url: 'https://erasmus.org.ge/large.png',
            width: 1024,
            height: 750,
          },
          bigger: {
            source_url: 'https://erasmus.org.ge/bigger.webp',
            width: 1280,
            height: 900,
          },
        },
      },
    },
  ];
  const selected = selectReviewImage({ id: 1, featured_media: 9 }, [], media);
  assert.equal(selected.url, 'https://erasmus.org.ge/large.png');
  assert.equal(selected.width, 1024);
  const heic = {
    id: 10,
    post: 1,
    mime_type: 'image/heic',
    source_url: 'https://erasmus.org.ge/photo.heic',
    media_details: { width: 800, height: 600 },
  };
  assert.equal(
    selectReviewImage({ id: 1, featured_media: 10 }, [], [heic]),
    null
  );
  assert.equal(
    selectReviewImage({ id: 1, featured_media: 10 }, [], [heic, ...media]).url,
    selected.url
  );
});

function pngHeader(width, height) {
  const bytes = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(bytes);
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

test('review image downloads retain provenance/alt placeholders and deduplicate network bytes', async () => {
  const records = [
    post(1, { featured_media: 9 }),
    post(2, { featured_media: 9 }),
  ];
  const media = [
    {
      id: 9,
      source_url: 'https://erasmus.org.ge/photo.png',
      mime_type: 'image/png',
      media_details: { width: 800, height: 600 },
    },
  ];
  const { results } = convertPosts(
    collections(records, { media: { items: media } }),
    run
  );
  const bytes = pngHeader(800, 600);
  let downloads = 0;
  const writes = [];
  const summary = await downloadReviewImages(
    results,
    records,
    media,
    {
      download: async () => {
        downloads++;
        return bytes;
      },
    },
    (path, body) => {
      writes.push(path);
      assert.deepEqual(body, bytes);
    }
  );
  assert.equal(downloads, 1);
  assert.equal(writes.length, 2);
  assert.ok(writes.every((path) => path.startsWith('images/')));
  assert.equal(summary.totalDownloadBytes, bytes.length);
  assert.equal(summary.totalFileBytes, bytes.length * 2);
  for (const row of results) {
    assert.deepEqual(row.news.image.alt, {
      ka: '[ALT NEEDED]',
      en: '[ALT NEEDED]',
    });
    assert.equal(row.news.image.sourceUrl, media[0].source_url);
    assert.equal(row.news.image.sizeBytes, bytes.length);
  }
  assert.deepEqual(imageDimensions(bytes), {
    format: 'png',
    width: 800,
    height: 600,
  });
  assert.throws(
    () => imageDimensions(Buffer.from('<html>Error</html>')),
    /not a supported/
  );
});

test('an image wider than advertised is rejected before any file is written', async () => {
  const records = [post(1, { featured_media: 9 })];
  const media = [
    {
      id: 9,
      source_url: 'https://erasmus.org.ge/photo.png',
      mime_type: 'image/png',
      media_details: { width: 1024, height: 600 },
    },
  ];
  const { results } = convertPosts(
    collections(records, { media: { items: media } }),
    run
  );
  let writes = 0;
  const summary = await downloadReviewImages(
    results,
    records,
    media,
    { download: async () => pngHeader(1600, 900) },
    () => {
      writes++;
    }
  );
  assert.equal(writes, 0);
  assert.equal(summary.files, 0);
  assert.equal(summary.failures.length, 1);
  assert.match(results[0].image.reason, /1024 px/);
});

test('review table and CSV provide one row per source without pre-approving a pair', () => {
  const c = collections([
    post(1, { content: { rendered: fixture('bilingual-source.html') } }),
  ]);
  const converted = convertPosts(c, run);
  const inventory = {
    items: converted.results.map(({ news, ...row }) => row),
    duplicates: converted.duplicates,
    pairCandidates: converted.pairCandidates,
    englishWithoutCandidate: converted.englishWithoutCandidate,
  };
  const csv = renderDecisions(inventory);
  assert.equal(csv.split('\n')[0], 'slug,keep,type,actions,pair_with,notes');
  assert.equal(csv.trim().split('\n').length, 2);
  assert.match(csv.split('\n')[1], /,"",/);
  const report = renderReport(
    {
      ...run,
      runDate: '2026-10-26',
      startedAt: '2026-10-26T12:00:00Z',
      finishedAt: '2026-10-26T12:00:01Z',
      counts: {
        convertedNews: 1,
        withEnglish: 0,
        eventCandidates: 1,
        failedConversions: 0,
      },
      collections: {},
      failures: [],
      languages: languageFindings(c),
    },
    inventory,
    { pages: { complete: true, items: [] } }
  );
  assert.ok(
    report.indexOf('## Quick keep/drop review') < report.indexOf('Run date')
  );
  assert.match(report, /\| Date \| Clean title \| Proposed slug \| Language/);
  assert.ok(report.includes(converted.results[0].slug));
  assert.match(report, /CANDIDATE within-post/);
  assert.match(report, /decisions\.csv/);
});
