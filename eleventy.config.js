import MarkdownIt from 'markdown-it';
import { localise, related, dateLabel } from './lib/content.js';
const markdown = new MarkdownIt({ html: false });
export default function (config) {
  config.ignores.add('src/assets/**/*.md');
  config.setNunjucksEnvironmentOptions({ autoescape: true });
  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy({ 'src/host/_redirects': '_redirects' });
  config.addWatchTarget('src/content');
  config.addFilter('localise', localise);
  config.addFilter('related', related);
  config.addFilter('dateLabel', dateLabel);
  config.addFilter('markdown', text => markdown.render(text || ''));
  config.addFilter('take', (items, count) => items.slice(0, count));
  config.addFilter('status', (items, value) => items.filter(i => i.status === value));
  config.addFilter('callYear', (items, year) => items.filter(i => i.year === year));
  config.addFilter('actionGroup', (items, actions, group) => items.filter(i => actions.find(a => a.slug === i.action)?.keyAction === group));
  config.addFilter('findSlug', (items, slug) => items.find(i => i.slug === slug));
  config.addFilter('forEvent', (items, slug) => items.filter(i => i.event === slug));
  config.addFilter('source', (items, source) => items.filter(i => i.source === source));
  return { dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' }, templateFormats: ['njk', 'md'], htmlTemplateEngine: 'njk', markdownTemplateEngine: 'njk' };
}
