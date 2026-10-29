import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
for(const lang of ['ka','en']) test(`polished ${lang} cards keep one native destination, credits and compact Home`,()=>{
 for(const route of ['', 'opportunities/', 'news/', 'find/', 'resources/', 'resources/publications/']) {
  const $=load(readFileSync(`_site/${lang}/${route}index.html`,'utf8'));
  for(const card of $('.card-clickable')) {
   assert.equal($(card).find('a').length,1);
   assert.equal($(card).find('a a,button,input,summary').length,0);
   assert.equal($(card).find('.card-primary').length,1);
  }
  assert.equal($('.preview-bar .notice').length,1);
  assert.equal($('main .notice').length,0);
  assert.equal($('footer a[href$="/about/credits/"]').length,1);
  assert.equal($('.news-text-only picture,.news-text-only .icon-slot').length,0);
  if(route==='') {
   assert.equal($('.cards-compact .card').length,9);
   assert.equal($('.cards-compact .card-body').length,0);
  }
 }
});
