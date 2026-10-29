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
  assert.equal(tiles.length,9);assert.equal(new Set(tiles).size,9);
  assert.equal($('.home-hero .portal-image[loading="eager"][fetchpriority="high"]').length,1);
  const values=projectData().stats.years.map(row=>row.count);
  assert.deepEqual($('.mini-chart [data-chart-value]').map((_,el)=>Number($(el).attr('data-chart-value'))).get(),values);
  assert.deepEqual($('.chart-table tbody td').map((_,el)=>Number($(el).text())).get(),values);
  assert.equal($('.home-figures [data-project-mobility-coverage]').length,1);
  assert.equal($('.cards-event .empty-state,.cards-call .empty-state').length,0);
 }
});
