import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import audiences from '../src/_data/findAudiences.json' with {type:'json'};
import {getPathPrefix} from '../lib/urls.js';
const prefix=getPathPrefix();
test('five bilingual static audience routes retain correct Action matches, contacts and switches',()=>{
 for(const lang of ['ka','en']) {
  const index=load(readFileSync(`_site/${lang}/find/index.html`,'utf8'));
  assert.equal(index('.audience-tiles li').length,5);
  for(const audience of audiences){
   const $=load(readFileSync(`_site/${lang}/find/${audience.slug}/index.html`,'utf8'));
   assert.deepEqual($('[data-find-action]').map((_,el)=>$(el).attr('data-find-action')).get(),audience.actions);
   assert.equal($('h1').text(),audience[lang]);
   assert.equal($('header a[hreflang]').attr('href'),`${prefix}${lang==='ka'?'en':'ka'}/find/${audience.slug}/`);
   for(const item of $('[data-find-action]')) {assert.equal($(item).find('strong').length,3);assert.ok($(item).find('a[href^="https://erasmus-plus.ec.europa.eu/"]').length);}
   assert.equal($('main script,main form').length,0);
  }
 }
});
