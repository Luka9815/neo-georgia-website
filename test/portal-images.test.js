import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import photos from '../src/_data/portalPhotos.json' with {type:'json'};
import {getPathPrefix} from '../lib/urls.js';
test('every portal photograph has checked permission, original bytes, credit and responsive local variants',()=>{
 const prefix=getPathPrefix();
 for(const photo of Object.values(photos)){
  assert.ok(photo.source.startsWith('https://'));
  assert.match(photo.licence,/approved/i);assert.equal(photo.checked,'2026-10-29');
  assert.equal(createHash('sha256').update(readFileSync('src'+photo.src)).digest('hex'),photo.sha256);
  for(const lang of ['ka','en']){
   const $=load(readFileSync(`_site/${lang}/about/index.html`,'utf8'));
   const picture=$('.portal-photo picture');assert.equal(picture.length,1);
   assert.equal(picture.find('source').length,2);
   assert.equal(picture.find('img').attr('loading'),'lazy');
   assert.equal(picture.find('img').attr('alt'),photo.alt[lang]);
   assert.ok($('.portal-photo figcaption').text().includes(photo.credit[lang]));
   for(const node of picture.find('[srcset]'))for(const variant of $(node).attr('srcset').split(',')) {
    const path=variant.trim().split(' ')[0];assert.ok(path.startsWith(prefix+'assets/generated/portal/'));assert.ok(existsSync('_site/'+path.slice(prefix.length)));
   }
  }
 }
 assert.match(readFileSync('src/assets/images/README.md','utf8'),/One reusable photograph/);
});
