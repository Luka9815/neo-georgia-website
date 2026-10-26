import { loadContent } from '../../lib/content.js';
export default function () {
  const content = loadContent();
  const views = [
    { lang: 'ka', kind: 'redirect', path: '/', alternate: '/en/' },
    { lang: 'ka', kind: '404', path: '/404.html', alternate: '/en/404.html' }
  ];
  const sections = ['home', 'opportunities', 'calls', 'events', 'news', 'stories', 'resources', '404'];
  for (const lang of ['ka', 'en']) {
    const other = lang === 'ka' ? 'en' : 'ka';
    for (const section of sections) {
      const suffix = section === 'home' ? '' : section === '404' ? '404.html' : `${section}/`;
      views.push({ lang, kind: section, path: `/${lang}/${suffix}`, alternate: `/${other}/${suffix}` });
    }
    for (const [type, folder] of [['action','opportunities'], ['event','events'], ['news','news'], ['story','stories'], ['page','']]) {
      for (const item of content[type].filter(i => i[lang])) {
        const suffix = `${folder ? `${folder}/` : ''}${item.slug}/`;
        views.push({ lang, kind: type, slug: item.slug, title: item[lang].title, path: `/${lang}/${suffix}`, alternate: item[other] ? `/${other}/${suffix}` : `/${other}/${folder || ''}/`.replace(/\/+/g, '/'), translated: Boolean(item[other]) });
      }
    }
  }
  return views;
}
