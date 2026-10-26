import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateNewsImage } from '../lib/news-image.js';
test('optional News image validates local files and alt text for published languages', () => {
  const root = mkdtempSync(join(tmpdir(), 'neo-image-validation-'));
  const file = join(root, 'src/content/news/sample.json');
  mkdirSync(join(root, 'src/assets/uploads'), { recursive: true });
  writeFileSync(join(root, 'src/assets/uploads/sample.png'), 'fixture');
  const image = { src: '/assets/uploads/sample.png', alt: { ka: '[SAMPLE] ფერადი მართკუთხედი.', en: '[SAMPLE] A coloured rectangle.' } };
  try {
    for (const optional of [undefined, null, '', {}, { src: '', alt: { ka: '', en: '' } }]) {
      const item = { image: optional }; validateNewsImage(item, file); assert.equal(item.image, undefined);
    }
    validateNewsImage({ image: structuredClone(image), en: {} }, file);
    validateNewsImage({ image: { src: image.src, alt: { ka: image.alt.ka } } }, file);
    for (const [path, value] of [['src', 'https://example.org/photo.png'], ['src', '/assets/eu/funded-en.png'], ['src', '/assets/uploads/../secret.png'], ['src', '/assets/uploads/missing.png'], ['alt.ka', ''], ['alt.ka', '[ALT NEEDED]'], ['alt.en', '[alt needed]'], ['alt.en', '']]) {
      const item = { image: structuredClone(image), en: {} };
      if (path.startsWith('alt.')) item.image.alt[path.slice(4)] = value; else item.image[path] = value;
      assert.throws(() => validateNewsImage(item, file), new RegExp(`image.${path}`));
    }
    writeFileSync(join(root, 'outside.png'), 'outside');
    symlinkSync(join(root, 'outside.png'), join(root, 'src/assets/uploads/escape.png'));
    assert.throws(() => validateNewsImage({ image: { ...image, src: '/assets/uploads/escape.png' } }, file), /inside src\/assets\/uploads/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

import { cpSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'cheerio';
test('real Eleventy image builds produce local responsive article/card pictures in both layouts', () => {
  const root = mkdtempSync(join(tmpdir(), 'neo-news-picture-'));
  try {
    for (const path of ['src', 'lib', 'eleventy.config.js', 'package.json']) cpSync(path, join(root, path), { recursive: true });
    symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
    cpSync('test/fixtures/sample-news-image.png', join(root, 'src/assets/uploads/sample-news-image.png'));
    const file = join(root, 'src/content/news/update-1.json');
    const item = JSON.parse(readFileSync(file));
    item.image = { src: '/assets/uploads/sample-news-image.png', alt: { ka: '[SAMPLE] ლურჯი მართკუთხედი.', en: '[SAMPLE] Blue rectangle, "quoted" <description>.' } };
    writeFileSync(file, JSON.stringify(item));
    for (const prefix of ['/', '/neo-georgia-website/']) {
      const output = join(root, prefix === '/' ? 'root-output' : 'project-output');
      execFileSync(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs', `--output=${output}`], { cwd: root, env: { ...process.env, PATH_PREFIX: prefix, SITE_URL: `https://example.org${prefix}` }, stdio: 'pipe' });
      for (const lang of ['ka', 'en']) for (const [path, article] of [[`${lang}/news/update-1/index.html`, true], [`${lang}/news/index.html`, false]]) {
        const $ = load(readFileSync(join(output, path), 'utf8'));
        const picture = $('main picture').first();
        assert.equal(picture.length, 1, path);
        assert.equal(picture.find('source[type="image/avif"]').length, 1);
        assert.equal(picture.find('source[type="image/webp"]').length, 1);
        const img = picture.find('img');
        assert.equal(img.attr('alt'), item.image.alt[lang]);
        assert.equal(img.attr('onerror'), undefined);
        assert.equal(img.attr('width'), '640'); assert.equal(img.attr('height'), '320');
        assert.equal(img.attr('loading'), article ? 'eager' : 'lazy');
        assert.equal(img.attr('decoding'), 'async');
        assert.ok(img.attr('sizes'));
        for (const el of picture.find('[srcset], [src]')) {
          const paths = [$(el).attr('src'), ...($(el).attr('srcset') || '').split(',').map(value => value.trim().split(' ')[0])].filter(Boolean);
          for (const url of paths) {
            assert.ok(url.startsWith(`${prefix}assets/generated/news/`), url);
            assert.ok(existsSync(join(output, url.slice(prefix.length))), url);
          }
        }
        assert.match(picture.find('source').first().attr('srcset'), /320w.*640w/);
        assert.equal($('[data-news-image]').length, 0);
        assert.equal($('.eu-emblem').attr('src'), `${prefix}assets/eu/funded-en.png`);
      }
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

import { load as yaml } from 'js-yaml';
test('CMS offers an optional News-only local image with Georgian-first alt labels', () => {
  const schema = yaml(readFileSync('.pages.yml', 'utf8'));
  const news = schema.content.find(item => item.name === 'news');
  const image = news.fields.find(field => field.name === 'image');
  assert.equal(image.required, false);
  assert.match(image.label, /^სურათი/);
  assert.equal(image.fields.find(field => field.name === 'src').type, 'image');
  const alt = image.fields.find(field => field.name === 'alt');
  assert.equal(alt.fields.find(field => field.name === 'ka').required, true);
  assert.equal(alt.fields.find(field => field.name === 'en').required, false);
  assert.equal(schema.content.find(item => item.name === 'events').fields.some(field => field.name === 'image'), false);
});
