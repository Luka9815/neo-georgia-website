import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import { getPathPrefix, absoluteUrl } from './lib/urls.js';
import MarkdownIt from 'markdown-it';
import { localise, related, dateLabel, callYears } from './lib/content.js';
const markdown = new MarkdownIt({ html: false });
export default function (config) {
  config.addPlugin(EleventyHtmlBasePlugin);
  config.addFilter('absoluteUrl', absoluteUrl);
  config.ignores.add('src/assets/**/*.md');
  config.setNunjucksEnvironmentOptions({ autoescape: true });
  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy({ 'src/nojekyll': '.nojekyll' });
  config.addWatchTarget('src/content');
  config.addFilter('localise', localise);
  config.addFilter('related', related);
  config.addFilter('dateLabel', dateLabel);
  config.addFilter('markdown', (text) => markdown.render(text || ''));
  // Preserve migrated wording while preventing skipped heading levels.
  config.addFilter('newsMarkdown', (text) => {
    const tokens = markdown.parse(text || '', {});
    let previous = 1;
    let level = 2;
    for (const token of tokens) {
      if (token.type === 'heading_open') {
        level = Math.max(2, Math.min(Number(token.tag.slice(1)), previous + 1));
        previous = level;
        token.tag = `h${level}`;
      } else if (token.type === 'heading_close') token.tag = `h${level}`;
    }
    return markdown.renderer.render(tokens, markdown.options, {});
  });
  config.addFilter('topic', (items, topic) => items.filter(item => item.topic === topic));
  config.addFilter('publicationYears', items => [...new Set(items.map(item => item.year))].sort((a, b) => b - a));
  config.addFilter('take', (items, count) => items.slice(0, count));
  config.addFilter('withoutStatus', (items, value) =>
    items.filter((item) => item.status !== value)
  );
  config.addFilter('status', (items, value) => items.filter((i) => i.status === value));
  config.addFilter('callYears', callYears);
  config.addFilter('callYear', (items, year) => items.filter((i) => i.year === year));
  config.addFilter('actionGroup', (items, actions, group) =>
    items.filter((i) => actions.find((a) => a.slug === i.action)?.keyAction === group)
  );
  config.addFilter('sector', (items, sector) =>
    items.filter((item) => item.sectors.includes(sector))
  );
  config.addFilter('findSlug', (items, slug) => items.find((i) => i.slug === slug));
  config.addFilter('forEvent', (items, slug) => items.filter((i) => i.event === slug));
  config.addFilter('source', (items, source) =>
    items.filter((i) => i.source === source)
  );
  return {
    pathPrefix: getPathPrefix(),
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
