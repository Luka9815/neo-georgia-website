// Luka's session 12 fallback, extended with nominatives in session 14. Longest suffix first, one removal per
// Georgian word, with at least four letters remaining. This is not a stemmer.
// Keep this as the single ending list; never alter indexed words or page text.
export const GEORGIAN_ENDINGS = Object.freeze([
  'ებისთვის', 'ისთვის', 'ებით', 'ების', 'ებს', 'ებში', 'ებზე', 'ისგან',
  'იდან', 'ამდე', 'ით', 'ის', 'ში', 'ზე', 'თან', 'ად', 'მა', 'ს',
  'ა', 'ი', // Nominatives remain last; the same four-letter minimum applies.
].sort((a, b) => [...b].length - [...a].length));
export function stripGeorgianEnding(word) {
  const lower = word.toLowerCase();
  const ending = GEORGIAN_ENDINGS.find(ending => lower.endsWith(ending));
  if (!ending) return word;
  const shortened = lower.slice(0, -ending.length);
  return [...shortened].length >= 4 ? shortened : word;
}
export function queryVariants(query, lang) {
  if (!query.trim()) return [];
  if (lang !== 'ka') return [query];
  const shortened = query.replace(/\p{Script=Georgian}+/gu, stripGeorgianEnding);
  return [...new Set([query, shortened])];
}
export async function searchWithFallback(engine, query, lang) {
  const merged = new Map();
  // Sequential queries retain every as-typed result ahead of fallback results.
  for (const variant of queryVariants(query, lang)) {
    const found = await engine.search(variant);
    for (const result of found.results) if (!merged.has(result.id)) merged.set(result.id, result);
  }
  return [...merged.values()];
}
