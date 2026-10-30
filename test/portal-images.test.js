import {loadContent} from '../lib/content.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import photos from '../src/_data/portalPhotos.json' with {type:'json'};
import placements from '../src/_data/photoPlacements.json' with {type:'json'};
import {getPathPrefix} from '../lib/urls.js';
const routes={sameba:'',tsuMain:'about/',ilia:'find/student/',rike:'find/youth/',gtu:'find/vet/',batumi:'find/sport/',river:'opportunities/'};
const commons=Object.values(photos).filter(p=>p.author);
const prefix=getPathPrefix();
const readme=readFileSync('src/assets/images/README.md','utf8');

test('all active Commons sources retain their reviewed hashes, dimensions and per-image README provenance outside output',()=>{
 assert.equal(commons.length,7);
 assert.equal(placements.home,'sameba');assert.equal(placements.about,'tsuMain');assert.equal(placements.opportunities,'river');
 assert.deepEqual(placements.find,{student:'ilia',youth:'rike',vet:'gtu',sport:'batumi'});
 assert.ok(!existsSync('_site/assets/images/source'));
 for(const photo of commons){
  const name=photo.src.split('/').at(-1);
  const entry=readme.split(`## ${name}\n`)[1]?.split('\n## ')[0];assert.ok(entry,name);
  for(const value of [photo.author,photo.licence,photo.licenceUrl,photo.source,photo.sha256])assert.ok(entry.includes(value),`${name}: ${value}`);
  assert.equal(createHash('sha256').update(readFileSync('src'+photo.src)).digest('hex'),photo.sha256);
  assert.equal(photo.width,Math.min(3840,photo.commonsOriginalWidth));
  assert.ok(Math.abs(photo.height-photo.commonsOriginalHeight*photo.width/photo.commonsOriginalWidth)<=1);
  assert.ok(photo.width>=1600);assert.equal(photo.checked,'2026-10-29');
 }
});

test('every Commons placement has local responsive variants and an accurate bilingual author licence source and modification credit',()=>{
 for(const lang of ['ka','en']){
  const strings=JSON.parse(readFileSync(`src/_data/${lang}.json`));
  const credits=load(readFileSync(`_site/${lang}/about/credits/index.html`,'utf8'));
  assert.equal(credits('[data-photo-source]').length,8);
  assert.equal(credits('[data-photo-source=tsuEvening]').length,0);
  const university=load(readFileSync(`_site/${lang}/find/university/index.html`,'utf8'));
  assert.equal(university('.portal-photo').length,0);
  assert.equal(university('h1').length,1);
  assert.equal(university('[data-find-action]').length,placements.find.university?0:5);
  for(const [id,route] of Object.entries(routes)){
   const photo=photos[id];const $=load(readFileSync(`_site/${lang}/${route}index.html`,'utf8'));
   const figure=$(`figure[data-photo-id="${id}"]`);assert.equal(figure.length,1,`${lang}/${route}`);
   assert.equal($('figure.portal-photo').length,1);
   const picture=figure.find('picture');assert.equal(picture.length,1);assert.equal(picture.find('source').length,2);
   const image=picture.find('img');assert.equal(image.attr('alt'),photo.alt[lang]);
   assert.equal(image.attr('loading'),'eager');assert.equal(image.attr('fetchpriority'),'high');assert.equal(image.attr('width'),'2560');
   for(const element of picture.find('[srcset]')){
    const variants=$(element).attr('srcset').split(',');assert.equal(variants.length,6);
    for(const variant of variants){const [path,width]=variant.trim().split(' ');assert.ok(path.startsWith(prefix+'assets/generated/portal/'));assert.ok(Number.parseInt(width)<=2560);assert.ok(existsSync('_site/'+path.slice(prefix.length)));}
   }
   assert.equal($('img[src*="/assets/images/source/"]').length,0);
   for(const caption of [figure.find('figcaption'),credits(`[data-photo-source="${id}"]`)]){
    assert.ok(caption.text().includes(photo.author));assert.equal(caption.find(`a[href="${photo.source}"]`).length,1);
    assert.equal(caption.find(`a[rel=license][href="${photo.licenceUrl}"]`).length,1);
    assert.ok(caption.text().includes(photo.publicDomain?strings.publicDomain:photo.licence));
    assert.ok(caption.text().includes(photo.crop===false?strings.photoResized:(photo.overlay?strings.photoModifiedOverlay:strings.photoModified)));
   }
  }
 }
});


test('approved NEO News photo credits follow the actual article and Home/archive selections',()=>{
 const photo=photos.dissemination;const news=loadContent().news.sort((a,b)=>b.date.localeCompare(a.date));
 for(const lang of ['ka','en']){
  const local=news.filter(item=>item[lang]);
  for(const route of ['','news/']){
   const selection=route?local:local.slice(0,3);const expected=selection.filter(item=>item.image?.src===photo.src);
   const $=load(readFileSync(`_site/${lang}/${route}index.html`,'utf8'));const cards=$('[data-news-photo-credit]').closest('.card');assert.equal(cards.length,expected.length);
   for(const card of cards){assert.equal($(card).find('a').length,1);assert.ok($(card).text().includes(photo.credit[lang]));}
  }
  for(const item of local.filter(item=>item.image?.src===photo.src)){
   const $=load(readFileSync(`_site/${lang}/news/${item.slug}/index.html`,'utf8'));
   assert.ok($('.news-photo figcaption').text().includes(photo.credit[lang]));assert.equal($('.news-photo img').attr('alt'),item.image.alt[lang]);assert.equal($('.news-photo a').attr('href'),photo.source);
  }
 }
});
