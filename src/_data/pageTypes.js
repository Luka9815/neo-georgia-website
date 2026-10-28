import getViews from './views.js';

// Keep route declarations central while each page type owns its template.
export default function () {
  const groups = Object.groupBy(getViews(), (view) => {
    if (view.kind === 'legacyRedirect') return 'redirect';
    if (view.kind === '404') return 'notFound';
    if (view.kind === 'news' && view.slug) return 'news-article';
    return view.kind;
  });
  // Empty optional collections still need pagination arrays so their templates
  // emit no routes when no real records exist.
  return { event: [], story: [], stories: [], ...groups };
}
