import getViews from './views.js';

// Keep route declarations central while each page type owns its template.
export default function () {
  return Object.groupBy(getViews(), (view) => {
    if (view.kind === '404') return 'notFound';
    if (view.kind === 'news' && view.slug) return 'news-article';
    return view.kind;
  });
}
