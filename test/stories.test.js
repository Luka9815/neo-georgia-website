import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {load} from 'cheerio';
import getViews from '../src/_data/views.js';
import {loadContent} from '../lib/content.js';
import {getPathPrefix} from '../lib/urls.js';
test('Stories routes, navigation, listings and sitemap reflect the actual language catalogue',()=>{
 const content=loadContent();const views=getViews();const prefix=getPathPrefix();
 const sitemap=readFileSync('_site/sitemap.xml','utf8');
 for(const lang of ['ka','en']){
  const stories=content.story.filter(item=>item[lang]);const present=stories.length>0;
  assert.equal(views.some(view=>view.kind==='stories'&&view.lang===lang),present);
  assert.equal(existsSync(`_site/${lang}/stories/index.html`),present);
  assert.equal(sitemap.includes(`/${lang}/stories/`),present);
  const home=load(readFileSync(`_site/${lang}/index.html`,'utf8'));
  const resources=load(readFileSync(`_site/${lang}/resources/index.html`,'utf8'));
  assert.equal(home('.home-story').length,present?1:0);
  assert.equal(resources(`a[href="${prefix}${lang}/stories/"]`).length,present?1:0);
  for(const action of content.action){
   const page=load(readFileSync(`_site/${lang}/opportunities/${action.slug}/index.html`,'utf8'));
   const expected=stories.filter(item=>item.action===action.slug).length;
   assert.equal(page('.cards-story > li').length,expected);
  }
 }
});
