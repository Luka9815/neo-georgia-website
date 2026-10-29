import { existsSync, realpathSync, statSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
export function validateNewsImage(item, file) {
  const fail = (field, message) => { throw new Error(`${file}: ${field}: ${message}`); };
  if (item.image == null || item.image === '') { delete item.image; return; }
  const image = item.image;
  if (typeof image !== 'object' || Array.isArray(image)) fail('image', 'expected an optional image object');
  if (!Object.keys(image).length) { delete item.image; return; }
  const blank = value => value == null || typeof value === 'string' && !value.trim();
  if (Object.keys(image).every(key => ['src', 'alt'].includes(key)) && blank(image.src) && blank(image.alt?.ka) && blank(image.alt?.en) && (image.alt == null || typeof image.alt === 'object' && !Array.isArray(image.alt))) { delete item.image; return; }
  if (typeof image.src !== 'string' || !/^\/assets\/uploads\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:jpe?g|png|webp|avif)$/i.test(image.src)) fail('image.src', 'use a local /assets/uploads/ JPG, PNG, WebP or AVIF path with ASCII filenames');
  const sourceRoot = resolve(dirname(file), '../..');
  const path = resolve(sourceRoot, image.src.slice(1));
  const uploads = resolve(sourceRoot, 'assets/uploads');
  if (!existsSync(path) || !statSync(path).isFile() || !realpathSync(path).startsWith(realpathSync(uploads) + sep)) fail('image.src', 'file must exist inside src/assets/uploads');
  if (!image.alt || typeof image.alt !== 'object' || Array.isArray(image.alt)) fail('image.alt', 'expected alt text by language');
  for (const lang of ['ka', 'en']) {
    if (image.alt[lang] != null && typeof image.alt[lang] !== 'string') fail(`image.alt.${lang}`, 'expected text');
    if (/\[ALT\s+NEEDED\]/i.test(image.alt?.[lang] || '')) fail(`image.alt.${lang}`, 'replace [ALT NEEDED] with approved alt text');
  }
  for (const lang of ['ka', 'en']) {
    const alt = image.alt?.[lang];
    if (typeof alt !== 'string' || !alt.trim()) fail(`image.alt.${lang}`, 'required non-empty alt text for this language');
  }
}
