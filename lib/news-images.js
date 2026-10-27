import Image from '@11ty/eleventy-img';
import { load } from 'cheerio';
import { join } from 'node:path';
// Only component-marked News images are transformed here. Official emblems
// have a separate whole-image PNG sizing transform; other images are untouched.
export async function renderNewsImages(content, outputRoot, prefix = '/') {
  if (!content.includes('data-news-image')) return content;
  for (const match of content.matchAll(/<img\b[^>]*\bdata-news-image\b[^>]*>/g)) {
    const image = load(match[0], null, false)('img');
    if (image.attr('data-news-image') === undefined) continue;
    let source = image.attr('src');
    if (prefix !== '/' && source.startsWith(prefix)) source = '/' + source.slice(prefix.length);
    const article = image.attr('data-image-layout') === 'article';
    try {
      const metadata = await Image(`src${source}`, {
        widths: [320, 640, 960, 1280],
        formats: ['avif', 'webp', /\.jpe?g$/i.test(source) ? 'jpeg' : 'png'],
        outputDir: join(outputRoot, 'assets/generated/news'),
        urlPath: `${prefix}assets/generated/news/`,
      });
      const html = Image.generateHTML(metadata, {
        alt: image.attr('alt'), class: 'news-image',
        sizes: article ? '(min-width: 64rem) 60rem, 100vw' : '(min-width: 64rem) 24rem, (min-width: 48rem) 45vw, 100vw',
        loading: article ? 'eager' : 'lazy', decoding: 'async',
        ...(article ? { fetchpriority: 'high' } : {}),
      });
      content = content.replace(match[0], () => html);
    } catch (cause) { throw new Error(`News image ${source}: ${cause.message}`, { cause }); }
  }
  return content;
}
