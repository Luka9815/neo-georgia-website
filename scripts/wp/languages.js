import { load } from 'cheerio';

const georgian = /\p{Script=Georgian}/u;
const content = (post) => {
  const $ = load(
    `${post.title?.rendered || ''} ${post.content?.rendered || ''}`,
    null,
    false
  );
  $('script, style, noscript').remove();
  return $.text();
};
const normalise = (text) =>
  text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function languageOf(post) {
  for (const value of [
    post.lang,
    post.language,
    post.wpml_language,
    post.language_code,
  ]) {
    const code = typeof value === 'string' ? value : value?.code || value?.slug;
    if (/^(ka|ge)(?:[-_]|$)/i.test(code || '')) return 'ka';
    if (/^en(?:[-_]|$)/i.test(code || '')) return 'en';
  }
  return null;
}

export function translationIds(post) {
  const result = {};
  for (const value of [post.translations, post.wpml_translations]) {
    const entries = Array.isArray(value)
      ? value.map((item) => [item.language_code || item.lang, item])
      : Object.entries(value || {});
    for (const [code, entry] of entries) {
      const id = Number(
        typeof entry === 'object' ? entry.id || entry.post_id : entry
      );
      if (['en', 'ka', 'ge'].includes(code) && Number.isInteger(id) && id > 0) {
        result[code === 'ge' ? 'ka' : code] = id;
      }
    }
  }
  return result;
}

export function languageFindings(collections) {
  const defaults = collections.posts?.items || [];
  const english = collections.english?.items || [];
  const all = [
    ...(collections.georgian?.items || []),
    ...defaults,
    ...english,
    ...(collections.translationLookup?.items || []),
  ];
  const byFirstId = new Map();
  for (const post of all)
    if (!byFirstId.has(post.id)) byFirstId.set(post.id, post);
  const posts = [...byFirstId.values()];
  const byId = new Map(posts.map((post) => [post.id, post]));
  const pairs = [];
  const warnings = [];
  for (const post of posts) {
    if (
      all.some(
        (variant) =>
          variant.id === post.id &&
          normalise(content(variant)) !== normalise(content(post))
      )
    ) {
      warnings.push(
        `Post ${post.id}: language queries returned different text under the same ID; retained the first Georgian/default source for manual review.`
      );
    }
  }
  for (const post of posts) {
    if (languageOf(post) === 'en') continue;
    const enId = translationIds(post).en;
    const reverse = posts.filter(
      (candidate) =>
        translationIds(candidate).ka === post.id &&
        languageOf(candidate) === 'en'
    );
    const candidate = enId
      ? byId.get(enId)
      : reverse.length === 1
        ? reverse[0]
        : null;
    if (!enId && !candidate) continue;
    if (!candidate) {
      warnings.push(
        `Post ${post.id}: declared English translation ${enId} unavailable.`
      );
    } else if (
      candidate.id === post.id ||
      normalise(content(post)) === normalise(content(candidate))
    ) {
      warnings.push(
        `Post ${post.id}: English relation repeats the same post/text; not imported as English.`
      );
    } else if (
      !candidate.title?.rendered?.trim() ||
      !candidate.content?.rendered?.trim() ||
      georgian.test(content(candidate)) ||
      languageOf(candidate) === 'ka'
    ) {
      warnings.push(
        `Post ${post.id}: linked English version is empty or contains Georgian; review manually.`
      );
    } else {
      pairs.push({
        ka: post.id,
        en: candidate.id,
        evidence:
          'Explicit REST translation relation and distinct non-Georgian content',
      });
    }
  }
  const defaultIds = new Set(defaults.map((post) => post.id));
  const englishIds = new Set(english.map((post) => post.id));
  const sameIds =
    defaults.length > 0 &&
    defaultIds.size === englishIds.size &&
    [...defaultIds].every((id) => englishIds.has(id));
  return {
    conclusion:
      !collections.posts?.complete || !collections.english?.complete
        ? 'Incomplete language check: a REST collection failed. No absence of English can be concluded.'
        : pairs.length
          ? `Found ${pairs.length} explicit, distinct English translation pair(s). No translation was guessed.`
          : 'No verifiable linked English versions found in the returned window. This does not prove the whole old site has no English.',
    explicitEnglishIds: posts
      .filter((p) => languageOf(p) === 'en')
      .map((p) => p.id),
    translationFieldsOnIds: posts
      .filter((p) => Object.keys(translationIds(p)).length)
      .map((p) => p.id),
    englishQuery: {
      complete: Boolean(collections.english?.complete),
      count: english.length,
      sameIdsAsDefault: sameIds,
      distinctIds: english
        .filter((p) => !defaultIds.has(p.id))
        .map((p) => p.id),
      note: sameIds
        ? '?lang=en returned the same IDs as the default query; it may be ignored. This is not an English translation.'
        : 'Different query results alone do not establish translation pairs.',
    },
    pairs,
    warnings,
    unclassifiedIds: posts
      .filter((p) => !languageOf(p) && !georgian.test(content(p)))
      .map((p) => p.id),
  };
}

export function isGeorgian(post) {
  return (
    languageOf(post) === 'ka' ||
    (!languageOf(post) && georgian.test(content(post)))
  );
}
