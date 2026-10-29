import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'js-yaml';
import {loadContent} from '../lib/content.js';
import {eventOptions} from '../lib/validate-content.js';
import {publicationTypes,faqTopics} from '../lib/validate-supporting.js';
import {resourceTypes} from '../lib/validate-extra.js';
const config=load(readFileSync('.pages.yml','utf8'));const entries=config.content.flatMap(e=>e.items||[e]);
const field=(entry,name)=>entry.fields.find(f=>f.name===name);
const choices=(entry,name)=>field(entry,name).options.values.map(v=>v.name);
test('every CMS collection has stable validated slugs and required translated text',()=>{
 const required={news:['slug','date','ka'],events:['slug','date','end','timeZone','type','format','organiser','actions','ka','en'],calls:['slug','action','year','deadline','timeZone','url','sourceChecked','ka','en'],faq:['slug','topic','actions','sourceUrl','sourceChecked','ka','en'],resources:['slug','source','type','language','year','actions','url','sourceChecked','ka','en'],publications:['slug','year','type','language','sourceChecked','ka','en'],stories:['slug','action','year','ka']};
 for(const entry of entries.filter(e=>e.type==='collection')){
  assert.deepEqual(entry.fields.filter(f=>f.required).map(f=>f.name).sort(),required[entry.name].sort(),entry.name+' required fields');
  for(const name of ['url','sourceUrl','registration']){const f=field(entry,name);if(f){const re=new RegExp(f.pattern.regex);assert.ok(re.test('https://example.org/path'));assert.ok(!re.test('http://example.org/path'));}}
  if(field(entry,'sourceChecked')){assert.equal(field(entry,'sourceChecked').type,'date');assert.equal(field(entry,'sourceChecked').options.format,'yyyy-MM-dd');}

  assert.equal(entry.filename.template,'{fields.slug}.json');const slug=field(entry,'slug');assert.equal(slug.required,true);const re=new RegExp(slug.pattern.regex);assert.ok(re.test('valid-slug'));for(const bad of ['Bad','../bad','bad--slug'])assert.ok(!re.test(bad));
  for(const lang of ['ka','en']){assert.equal(field(entry,lang).required,lang==='ka'||!['news','stories'].includes(entry.name));for(const key of ['title','body'])assert.equal(field(field(entry,lang),key).required,true);}
 }
});
test('all Action options match current slugs and bilingual labels without public markers',()=>{
 const expected=loadContent().action.map(a=>({name:a.slug,label:`${a.ka.title} (${a.en.title})`}));
 for(const entry of entries)for(const f of entry.fields||[])if(['action','actions'].includes(f.name)){assert.deepEqual(f.options.values,expected);for(const option of f.options.values)assert.doesNotMatch(option.label,/\[(?:DRAFT|SAMPLE)\]/);}
});
test('CMS selects, wall-clock patterns, fixed Brussels zone and office form match validation',()=>{
 const entry=name=>entries.find(e=>e.name===name);
 for(const [name,values]of Object.entries(eventOptions))assert.deepEqual(choices(entry('events'),name),values);
 for(const [collection,key,values]of [['resources','source',['official','neo','partner']],['resources','type',resourceTypes],['publications','type',publicationTypes],['faq','topic',faqTopics]])assert.deepEqual(choices(entry(collection),key),values);
 assert.equal(field(entry('publications'),'year').options.min,2014);
 assert.equal(field(entry('publications'),'year').options.max,2100);
 for(const name of ['calls','resources','stories'])assert.equal(field(entry(name),'year').options.min,2000);
 const calls=entry('calls');for(const name of ['deadline','opens']){const re=new RegExp(field(calls,name).pattern.regex);assert.ok(re.test('2027-01-01T12:00'));assert.ok(!re.test('2027-01-01T12:00Z'));}
 assert.equal(field(calls,'timeZone').default,'Europe/Brussels');assert.equal(field(calls,'timeZone').readonly,true);assert.equal(field(calls,'timeZone').hidden,true);
 assert.equal(config.settings.content.merge,true);assert.ok(!field(entry('settings'),'siteLaunched'));assert.ok(field(entry('office'),'team'));assert.ok(field(entry('office'),'here'));assert.deepEqual(field(entry('publications'),'file').options.extensions,['pdf']);
});
