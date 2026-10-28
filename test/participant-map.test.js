import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {loadMappedProjects} from '../lib/projects.js';
import {participantCities} from '../lib/participant-map.js';
import {getPathPrefix} from '../lib/urls.js';
const read=file=>JSON.parse(readFileSync(file,'utf8'));
test('mapped and unresolved bubbles and table rows reconcile to all 605 named organisations in both languages',()=>{
 const data=participantCities(loadMappedProjects().projects);
 assert.equal(data.total,605);assert.equal(data.unknown,38);
 assert.equal(data.cities.reduce((sum,c)=>sum+c.count,0)+data.unknown,data.total);
 for(const lang of ['ka','en']){
  const $=load(readFileSync(`_site/${lang}/resources/statistics/index.html`,'utf8'));
  assert.equal($('[data-map-count]').toArray().reduce((sum,n)=>sum+Number($(n).attr('data-map-count')),0),605);
  assert.equal($('[data-participant-cities] tbody td').toArray().reduce((sum,n)=>sum+Number($(n).text()),0),605);
  assert.equal($('.participant-map path').length,1);
  for(const link of $('.participant-map a')){assert.ok($(link).attr('aria-label'));assert.ok($($(link).attr('href')).length);}
  const projects=load(readFileSync(`_site/${lang}/resources/projects/index.html`,'utf8'));
  assert.ok(projects(`a[href="${getPathPrefix()}${lang}/resources/statistics/#participant-map"]`).length);
 }
});
test('reviewed city variants deduplicate by source ID while conflicts, unknowns and mobility remain explicit',()=>{
 const org=(id,city)=>({id,name:id,city,role:'partner'});
 const result=participantCities([{organisations:[org('a','Tbilisi'),org('b','TIFLIS'),org('c',''),org('d','New unreviewed place'),{...org('m',''),role:'country-mobility'}]},{organisations:[org('a','TBILISI'),org('e','Rustavi')]},{organisations:[org('e','Tbilisi')]}]);
 assert.equal(result.total,5);assert.equal(result.cities[0].count,2);assert.equal(result.unknown,3);
 assert.deepEqual(new Set(result.unresolved.map(row=>row.reason)),new Set(['missing','conflict','unmapped']));
});
test('committed public-domain outline includes both regions and has no internal borders; coordinate sources are dated',()=>{
 const outline=read('src/assets/maps/georgia.geojson');const source=read('src/assets/maps/source.json');
 assert.equal(source.licence,'Public domain');assert.equal(source.checked,'2026-10-29');assert.ok(source.source.includes('/ne_50m_admin_0_countries.geojson'));
 assert.equal(outline.geometry.type,'Polygon');assert.equal(outline.geometry.coordinates.length,1);
 const ring=outline.geometry.coordinates[0];assert.deepEqual(ring[0],ring.at(-1));
 function inside([x,y]){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)yes=!yes;}return yes;}
 for(const point of Object.values(source.controlPoints))assert.ok(inside(point));
 for(const city of read('src/_data/cityLocations.json').cities){assert.ok(city.source.startsWith('https://www.geonames.org/'));assert.equal(city.checked,'2026-10-29');assert.ok(inside([city.longitude,city.latitude]));}
});
