import { load } from 'cheerio';
import { renderEuImages } from './lib/eu-images.js';
import { renderNewsImages } from './lib/news-images.js';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import { getPathPrefix, absoluteUrl } from './lib/urls.js';
import MarkdownIt from 'markdown-it';
import { localise, related, dateLabel, callYears } from './lib/content.js';
const markdown = new MarkdownIt({ html: false });
export default function (config) {
  config.addPlugin(EleventyHtmlBasePlugin);
  let outputRoot = '_site';
  config.on('eleventy.before', ({ directories }) => { outputRoot = directories.output; });
  config.addTransform('news-images', async function (content) {
    return (this.page?.outputPath || this.outputPath || '').endsWith('.html')
      ? renderNewsImages(content, outputRoot, getPathPrefix()) : content;
  });
  config.addTransform('eu-images', async function (content) {
    return (this.page?.outputPath || this.outputPath || '').endsWith('.html')
      ? renderEuImages(content, outputRoot, getPathPrefix()) : content;
  });
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
  config.addFilter('newsSummary', (text) => {
    const tokens = markdown.parse(text || '', {});
    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i].type !== 'paragraph_open') continue;
      const inline = tokens[i + 1];
      let strong = 0;
      const prose = inline.children?.some(token => {
        if (token.type === 'strong_open') strong++;
        if (token.type === 'strong_close') strong--;
        return token.type === 'text' && strong === 0 && /\p{L}/u.test(token.content);
      });
      if (prose) {
        const words = load(markdown.renderInline(inline.content)).text().trim().split(/\s+/);
        const excerpt = words.slice(0, 30).join(' ') + (words.length > 30 ? '…' : '');
        return `<p>${markdown.utils.escapeHtml(excerpt)}</p>`;
      }
    }
    return '';
  });
  config.addFilter('newsMarkdown', (text, title = '') => {
    const formatted = (text || '').replace(/^(\*\*[^*\n]+\*\*)(?=\p{L})/gmu, '$1  \n').replace(/:(?=\[)/g, ': ');
    const tokens = markdown.parse(formatted, {});
    // Suppress an exact duplicate title heading at render time only.
    const plain = value => markdown.renderInline(value).replace(/<[^>]+>/g, '').trim();
    if (['heading_open', 'paragraph_open'].includes(tokens[0]?.type) && plain(tokens[1].content) === plain(title)) tokens.splice(0, 3);
    // Source-only bold section lines become navigable headings without changing their words.
    for (let i = 0; i < tokens.length - 2; i++) {
      if (tokens[i].type !== 'paragraph_open') continue;
      const content = tokens[i + 1].content;
      if (!/^\*\*[^*]+\*\*$/.test(content)) continue;
      tokens[i].type = 'heading_open'; tokens[i].tag = 'h2';
      tokens[i + 2].type = 'heading_close'; tokens[i + 2].tag = 'h2';
    }
    // A single bold project label before source items 2 and 3 is item 1.
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'bullet_list_open') continue;
      const end = tokens.findIndex((token, j) => j > i && token.type === 'bullet_list_close' && token.level === tokens[i].level);
      if (end < 0) continue;
      const block = tokens.slice(i + 1, end);
      const label = block.find(token => token.type === 'inline')?.content || '';
      const nextOrdered = tokens.slice(end + 1).find(token => token.type === 'ordered_list_open');
      if (block.filter(token => token.type === 'list_item_open').length === 1 && /^\*\*[^*]+\*\*$/.test(label) && Number(nextOrdered?.attrGet('start')) === 2) {
        tokens[i].type = 'ordered_list_open'; tokens[i].tag = 'ol';
        tokens[end].type = 'ordered_list_close'; tokens[end].tag = 'ol';
      }
    }
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
  config.addFilter('personGroup', (items, group) => items.filter(item => item.group === group));
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
