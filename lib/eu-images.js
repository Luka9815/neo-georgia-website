import Image from '@11ty/eleventy-img';
import { load } from 'cheerio';
import { join } from 'node:path';

// Resize the complete official PNG without cropping, redrawing or recolouring it.
export async function renderEuImages(content, outputRoot, prefix = '/') {
  if (!content.includes('data-eu-emblem')) return content;
  for (const match of content.matchAll(/<img\b[^>]*\bdata-eu-emblem\b[^>]*>/g)) {
    const image = load(match[0], null, false)('img');
    let source = image.attr('src');
    if (prefix !== '/' && source.startsWith(prefix)) source = '/' + source.slice(prefix.length);
    if (!['/assets/eu/funded-ka.png', '/assets/eu/funded-en.png'].includes(source)) {
      throw new Error(`Unexpected official emblem source: ${source}`);
    }
    const metadata = await Image(`src${source}`, {
      widths: [480, 960], formats: ['png'],
      outputDir: join(outputRoot, 'assets/generated/eu'),
      urlPath: `${prefix}assets/generated/eu/`,
    });
    const html = Image.generateHTML(metadata, {
      alt: image.attr('alt'), class: 'eu-emblem',
      sizes: '(min-width: 36rem) 30rem, 100vw',
      loading: 'lazy', decoding: 'async',
    });
    content = content.replace(match[0], () => html);
  }
  return content;
}
