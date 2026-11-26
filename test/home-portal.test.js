import {loadContent} from '../lib/content.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import projectData from '../src/_data/projectData.js';
test('portal home has five audience paths, nine distinct Action tiles, a real photo and equivalent mini-chart data',()=>{
 for(const lang of ['ka','en']){
  const $=load(readFileSync(`_site/${lang}/index.html`,'utf8'));
  assert.equal($('.audience-tiles li').length,5);
  const tiles=$('.home-action-sector .cards-action h4 a').map((_,el)=>$(el).attr('href')).get();
  assert.equal(tiles.length,loadContent().action.length);assert.equal(new Set(tiles).size,loadContent().action.length);
  assert.equal($('.home-hero .portal-image[loading="eager"][fetchpriority="high"]').length,1);
  const values=projectData().stats.years.map(row=>row.count);
  assert.deepEqual($('.mini-chart [data-chart-value]').map((_,el)=>Number($(el).attr('data-chart-value'))).get(),values);
  assert.deepEqual($('.chart-table tbody td').map((_,el)=>Number($(el).text())).get(),values);
  const note=$('.home-figures [data-project-mobility-coverage]');
  assert.equal(note.length,1);
  assert.equal(note.parent('details.figures-data').length,1);
  assert.equal(note.parent().attr('open'),undefined);
  assert.equal($('.home-figures > .wrapper > p.figures-note time').length,1);
  assert.ok($('.home-figures > .wrapper > p:last-child a').attr('href').endsWith('/resources/statistics/'));
  assert.equal($('.cards-event .empty-state,.cards-call .empty-state').length,0);
 }
});

test('compact and empty-state strings avoid hard-coded years', () => {
 for(const lang of ['ka','en']) {
  const strings=JSON.parse(readFileSync(`src/_data/${lang}.json`, 'utf8'));
  for(const [key,value] of Object.entries(strings)) {
   if (/compact|empty|fallback|none|nojs/i.test(key) && typeof value === 'string') {
    assert.doesNotMatch(value, /(?<!\d)\d{4}(?!\d)/, `${lang}.${key}`);
   }
  }
 }
});
