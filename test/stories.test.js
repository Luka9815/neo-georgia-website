import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {load} from 'cheerio';
import getViews from '../src/_data/views.js';
import {loadContent} from '../lib/content.js';
test('empty Stories have no routes, links, listings or sitemap entries',()=>{
 assert.equal(loadContent().story.length,0);
 assert.ok(getViews().every(view=>!['story','stories'].includes(view.kind)));
 assert.doesNotMatch(readFileSync('_site/sitemap.xml','utf8'),/\/stories\//);
 for(const lang of ['ka','en']){
  assert.ok(!existsSync(`_site/${lang}/stories/index.html`));
  for(const route of ['', 'resources/', 'opportunities/cbhe/']){
   const $=load(readFileSync(`_site/${lang}/${route}index.html`,'utf8'));
   assert.equal($('a[href*="/stories/"],.home-story,.cards-story').length,0);
  }
 }
});
