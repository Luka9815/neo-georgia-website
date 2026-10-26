import { readFileSync } from 'node:fs';

// Legacy URLs must be static files, not external redirects or query-string rules.
export function redirectViews(views, mappings = JSON.parse(
  readFileSync('src/_data/redirects.json', 'utf8')
)) {
  const occupied = new Set(views.map(view => view.path));
  const targets = new Set(views.filter(view => !['redirect', '404'].includes(view.kind))
    .map(view => view.path));
  return mappings.map(({ from, to }) => {
    if (typeof from !== 'string' || !/^\/(?:[A-Za-z0-9_-]+\/)*(?:[A-Za-z0-9_-]+\.html)?$/.test(from)
      || from === '/' || occupied.has(from) || occupied.has(from.replace(/index\.html$/, ''))) {
      throw new Error(`Invalid or colliding legacy redirect path: ${from}`);
    }
    if (!targets.has(to)) throw new Error(`Legacy redirect target is not a page: ${to}`);
    occupied.add(from);
    occupied.add(from.replace(/index\.html$/, ''));
    return {
      kind: 'legacyRedirect', lang: 'ka', path: from, target: to,
      alternate: '/en/', translated: false,
    };
  });
}
