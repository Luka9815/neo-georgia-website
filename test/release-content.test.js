import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {load} from 'cheerio';
import {loadContent} from '../lib/content.js';
import {validateSupporting} from '../lib/validate-supporting.js';
import {getPathPrefix} from '../lib/urls.js';
const content=loadContent();const prefix=getPathPrefix();
const read=file=>JSON.parse(readFileSync(file,'utf8'));
const page=(lang,route)=>load(readFileSync(`_site/${lang}/${route}index.html`,'utf8'));
test('all release content sources have a dated verification record and official HTTPS destinations',()=>{
 const sources=read('docs/review/session-20/SOURCES.json').sources;
 const checked=new Map(sources.map(source=>[source.url,source]));
 const urls=new Set();
 function visit(value){
  if(typeof value==='string')for(const match of value.matchAll(/https:\/\/[^\s)\]<>"']+/g))urls.add(match[0].replace(/[.,;]+$/,''));
  else if(value&&typeof value==='object')for(const child of Object.values(value))visit(child);
 }
 for(const type of ['action','call','faq','resource','publication','page'])visit(content[type]);
 visit(read('src/_data/here.json'));
 for(const url of urls){assert.ok(checked.has(url),url);assert.equal(checked.get(url).checked,'2026-10-28');assert.ok(checked.get(url).evidence);}
});
test('official Resources remain external and requested partner/statistics navigation is present in both languages',()=>{
 assert.equal(content.resource.length,4);
 for(const item of content.resource){assert.equal(item.source,'official');assert.ok(item.url.startsWith('https://'));assert.equal(item.sourceChecked,'2026-10-28');}
 for(const lang of ['ka','en']){
  const $=page(lang,'resources/');assert.equal($('.cards-resource > li').length,4);
  for(const path of ['opportunities/find-partners/','resources/statistics/'])assert.equal($(`main a[href="${prefix}${lang}/${path}"]`).length,1);
 }
});
test('verified Publications show publisher/year, link externally and replace sample downloads with the archive note',()=>{
 assert.equal(content.publication.length,2);
 for(const item of content.publication){assert.ok(item.url.startsWith('https://'));assert.ok(item.publisher);assert.equal(item.file,undefined);}
 for(const lang of ['ka','en']){
  const $=page(lang,'resources/publications/');assert.equal($('[data-publication-archive-note]').length,1);
  assert.equal($('.cards-publication a[href^="https:"]').length,2);
 }
 for(const slug of ['sample-report','sample-brochure'])assert.ok(!existsSync(`_site/assets/publications/${slug}.txt`));
 const actions=new Set(content.action.map(item=>item.slug));
 for(const [field,value] of [['url','http://example.invalid/report'],['publisher','']]){
  const item={...content.publication[0],[field]:value};assert.throws(()=>validateSupporting(item,'publication',`src/content/publication/${item.slug}.json`,actions),new RegExp(field));
 }
});
test('Team has three explicit role cards and HERE uses guidance rather than a fictional person',()=>{
 assert.equal(content.person.length,3);assert.deepEqual(content.person.map(item=>item.slug).sort(),['communications-officer','coordinator','programme-officer']);
 for(const item of content.person){assert.equal(item.group,'neo');assert.ok(item.name?.trim());assert.ok(item.roleEmail?.trim());assert.doesNotMatch(item.name+item.roleEmail,/\[(?:SAMPLE|DRAFT)\]/);}
 for(const lang of ['ka','en']){
  const strings=read(`src/_data/${lang}.json`);const team=page(lang,'about/team/');const here=page(lang,'here/');
  assert.equal(team('.cards-person > li').length,3);assert.equal(team('main').text().split(strings.neoContactLine).length,2);
  assert.equal(here('.cards-person').length,0);assert.ok(here('main').text().includes(strings.hereList));
  assert.equal(here('main a[href="https://erasmus-networks.ec.europa.eu/aboutsphere"]').length,1);
 }
});
test('dated policy pages and final preview retain noindex without claiming launch or public draft status',()=>{
 assert.equal(read('src/_data/settings.json').siteLaunched,false);
 for(const lang of ['ka','en']){
  const strings=read(`src/_data/${lang}.json`);assert.ok(!('sample' in strings)&&!('contactPlaceholder' in strings)&&!('socialPlaceholder' in strings));
  for(const slug of ['privacy','accessibility']){
   const item=content.page.find(item=>item.slug===slug);assert.match(item.updated,/^\d{4}-\d{2}-\d{2}$/);
   const $=page(lang,`${slug}/`);assert.match($('meta[name=robots]').attr('content'),/noindex/);assert.equal($('.notice').text(),strings.previewNotice);
  }
 }
});
