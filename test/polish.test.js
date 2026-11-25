import {loadContent} from '../lib/content.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
for(const lang of ['ka','en']) test(`polished ${lang} cards keep one native destination, credits and compact Home`,()=>{
 for(const route of ['', 'opportunities/', 'news/', 'find/', 'resources/', 'resources/publications/']) {
  const $=load(readFileSync(`_site/${lang}/${route}index.html`,'utf8'));
  for(const card of $('.card-clickable')) {
   const node=$(card);
   assert.equal(node.find('a').not('.photo-credit-panel a').length,1);
   assert.equal(node.find('a a,button,input').length,0);
   assert.equal(node.find('summary').not('.photo-credit-control > summary').length,0);
   assert.equal(node.find('.card-primary').length,1);
   assert.equal(node.find('.card-arrow[aria-hidden="true"]').length,1);
  }
  assert.equal($('.preview-bar .notice').length,1);
  assert.equal($('main .notice').length,0);
  assert.equal($('footer a[href$="/about/credits/"]').length,1);
  assert.equal($('.news-placeholder').not('[aria-hidden="true"]').length,0);
  if(route==='') {
   assert.equal($('.cards-compact .card').length,loadContent().action.length);
   assert.equal($('.cards-compact .card-body').length,0);
  }
 }
});
