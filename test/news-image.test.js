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
