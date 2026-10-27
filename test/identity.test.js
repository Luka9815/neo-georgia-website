import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { getPathPrefix } from '../lib/urls.js';
const prefix = getPathPrefix();
const originals = {
  ka: ['5d787b78f89af4c09b5d8ecc52e711eae1c84348e09511fe27a8b3a12863c517', 4246, 890],
  en: ['d075e964f944e97fbc543ef883415da8397a1fe148c324724612109dc7735375', 4125, 919],
};

test('official emblem originals retain verified bytes and full-aspect PNG derivatives', () => {
  for (const [lang, [hash, width, height]] of Object.entries(originals)) {
    const original = readFileSync(`src/assets/eu/funded-${lang}.png`);
    assert.equal(createHash('sha256').update(original).digest('hex'), hash);
    assert.equal(original.readUInt32BE(16), width);
    assert.equal(original.readUInt32BE(20), height);
    const $ = load(readFileSync(`_site/${lang}/index.html`, 'utf8'));
    const image = $('.eu-emblem');
    assert.ok(image.attr('srcset'));
    for (const value of image.attr('srcset').split(',')) {
      const [url, size] = value.trim().split(/\s+/);
      assert.ok(url.startsWith(`${prefix}assets/generated/eu/`));
      const bytes = readFileSync('_site/' + url.slice(prefix.length));
      assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
      const renderedWidth = Number(size.slice(0, -1));
      assert.equal(bytes.readUInt32BE(16), renderedWidth);
      assert.ok([480, 960].includes(renderedWidth));
      assert.ok(Math.abs(bytes.readUInt32BE(20) - height * renderedWidth / width) <= 1);
    }
    assert.equal($('.eu-funding strong').length, 0);
    assert.ok(existsSync('_site/assets/favicon.svg'));
    assert.equal($('.brand').attr('href'), `${prefix}${lang}/`);
  }
});

test('favicon is typography only and contains no flag or programme artwork', () => {
  const $ = load(readFileSync('src/assets/favicon.svg', 'utf8'), { xmlMode: true });
  assert.equal($('text').text(), 'E+');
  assert.equal($('image, path, polygon, use').length, 0);
});
