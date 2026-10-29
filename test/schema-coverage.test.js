import test from 'node:test';import assert from 'node:assert/strict';
import {loadContent,zonedDateTime}from'../lib/content.js';import{validateExtra,validateSourceDate}from'../lib/validate-extra.js';import{validateSupporting}from'../lib/validate-supporting.js';
const content=loadContent();const actions=new Set(content.action.map(a=>a.slug));const events=new Set(content.event.map(e=>e.slug));
for(const type of ['action','resource','page'])test(`${type} validates required text, slugs and filenames`,()=>{
 const original=content[type][0];for(const [field,value]of [['slug','../bad'],['ka',{}],['en',null]]){const item={...structuredClone(original),[field]:value};assert.throws(()=>validateExtra(item,type,`src/content/${type}/${original.slug}.json`,actions,events),error=>error.message.includes(`src/content/${type}/${original.slug}.json:`));}
});
for(const type of ['call','faq','resource','publication'])test(`${type} requires a valid sourceChecked date`,()=>{for(const value of [undefined,'2027-02-30','2027-01-01T00:00']){const item={...content[type][0],sourceChecked:value};assert.throws(()=>validateSourceDate(item,type,`src/content/${type}/${item.slug}.json`),/sourceChecked/);}});
test('optional-English Story validates Action/year and drops empty CMS translation objects',()=>{
 const item={slug:'fixture',action:[...actions][0],year:2027,ka:{title:'ტესტი',body:'ტესტი'},en:{title:'',body:''}};validateExtra(item,'story','fixture.json',actions,events);assert.equal(item.en,undefined);
 for(const [field,value]of [['action','missing'],['year',2027.5],['ka',{}]])assert.throws(()=>validateExtra({...item,[field]:value},'story','fixture.json',actions,events),new RegExp(field));
});
test('FAQ needs an HTTPS source and Calls accept omitted optional opening times',()=>{
 const faq={...content.faq[0],sourceUrl:''};assert.throws(()=>validateSupporting(faq,'faq',`${faq.slug}.json`,actions,zonedDateTime),/sourceUrl/);
 const call={...content.call[0],opens:''};validateSupporting(call,'call',`${call.slug}.json`,actions,zonedDateTime);assert.equal(call.opens,undefined);
});
