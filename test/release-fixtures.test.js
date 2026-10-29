import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,rmSync} from 'node:fs';
import {load} from 'cheerio';
import {createFixtureSite,buildFixtureSite} from '../scripts/fixture-site.js';
import {eventStatus} from '../lib/content.js';
import {getPathPrefix} from '../lib/urls.js';
test('isolated sample content retains relationships, local-publication downloads and per-Event ICS coverage',()=>{
 const root=createFixtureSite(['event','call','resource','story','publication']);const prefix=getPathPrefix();
 try {
  buildFixtureSite(root,prefix);
  const data=Object.fromEntries(['event','resource','publication'].map(type=>[type,readdirSync(`${root}/src/content/${type}`).filter(file=>file.endsWith('.json')).map(file=>JSON.parse(readFileSync(`${root}/src/content/${type}/${file}`,'utf8')))]));
  for(const item of data.resource.filter(item=>item.event))assert.ok(data.event.some(event=>event.slug===item.event));
  for(const lang of ['ka','en']){
   const home=load(readFileSync(`${root}/_site/${lang}/index.html`,'utf8'));
   assert.equal(home('.home-band, .home-hero').length,8);
   assert.equal(home(`main a[href="${prefix}${lang}/stories/"]`).length,1);
   const resources=load(readFileSync(`${root}/_site/${lang}/resources/index.html`,'utf8'));
   assert.equal(resources(`main a[href="${prefix}${lang}/stories/"]`).length,1);
   assert.ok(readFileSync(`${root}/_site/sitemap.xml`,'utf8').includes(`/${lang}/stories/`));
   for(const type of ['call','event','news']){
    const count=home(`.cards-${type} > .card:not(.empty-state)`).length;
    assert.ok(count>0);assert.equal(home(`.cards-${type} .card-section-label`).length,count);
   }
   const publications=load(readFileSync(`${root}/_site/${lang}/resources/publications/index.html`,'utf8'));
   for(const item of data.publication.filter(item=>item.file)){
    assert.equal(publications(`a[href="${prefix}${item.file.slice(1)}"]`).length,1);
    assert.equal(readFileSync(`${root}/_site${item.file}`,'utf8'),readFileSync(`test/fixtures/release-publications/${item.file.split('/').at(-1)}`,'utf8'));
   }
   const action=load(readFileSync(`${root}/_site/${lang}/opportunities/cbhe/index.html`,'utf8'));
   assert.equal(action('.action-main > section').length,7);
   assert.equal(action('.action-facts').length,1);
   for(const suffix of ['events/past-session/','stories/example/','events/information-day/'])assert.ok(action(`main a[href$="/${suffix}"]`).length);
   for(const item of data.event){
    const ics=readFileSync(`${root}/_site/${lang}/events/${item.slug}/event.ics`,'utf8').replace(/\r\n /g,'');
    assert.match(ics,new RegExp(`UID:neo-georgia-event-${item.slug}\\r\\n`));
    assert.ok(ics.includes(`SUMMARY;LANGUAGE=${lang}:${item[lang].title}`));
    const detail=load(readFileSync(`${root}/_site/${lang}/events/${item.slug}/index.html`,'utf8'));
    assert.equal(detail(`a[href="${prefix}${lang}/events/${item.slug}/event.ics"][download]`).length,1);
    const feed=readFileSync(`${root}/_site/${lang}/events/upcoming.ics`,'utf8');
    assert.equal(feed.includes(`UID:neo-georgia-event-${item.slug}\r\n`),eventStatus(item)==='upcoming');
   }
  }
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('copied synthetic fixtures retain past/upcoming coverage after the January 2027 launch',()=>{
 const root=createFixtureSite();
 try{
  const year=new Date().getUTCFullYear();
  for(const [slug,offset] of [['information-day',1],['webinar',1],['past-session',-1]]){
   const item=JSON.parse(readFileSync(`${root}/src/content/event/${slug}.json`,'utf8'));
   assert.ok(item.date.startsWith(String(year+offset)));
   assert.equal(eventStatus(item),offset>0?'upcoming':'past');
  }
  const call=JSON.parse(readFileSync(`${root}/src/content/call/cbhe-2026.json`,'utf8'));
  assert.ok(call.deadline.startsWith(String(year+1)));
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('isolated empty Events and Stories remain covered when genuine production records are later added',()=>{
 const root=createFixtureSite([]);const prefix=getPathPrefix();
 try{
  for(const type of ['event','story'])for(const file of readdirSync(`${root}/src/content/${type}`)){
   if(file.endsWith('.json'))rmSync(`${root}/src/content/${type}/${file}`);
  }
  buildFixtureSite(root,prefix);
  for(const lang of ['ka','en']){
   for(const path of ['events','events/calendar']){
    const page=load(readFileSync(`${root}/_site/${lang}/${path}/index.html`,'utf8'));
    assert.equal(page('[data-events-empty]').length,1);
   }
   assert.doesNotMatch(readFileSync(`${root}/_site/${lang}/events/upcoming.ics`,'utf8'),/BEGIN:VEVENT/);
   assert.ok(!readFileSync(`${root}/_site/sitemap.xml`,'utf8').includes(`/${lang}/stories/`));
   const home=load(readFileSync(`${root}/_site/${lang}/index.html`,'utf8'));
   assert.equal(home('.home-story').length,0);
  }
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('historical populated fixtures choose their own call edition independently of staff Settings',()=>{
 const root=createFixtureSite([]);try{assert.equal(JSON.parse(readFileSync(`${root}/src/_data/settings.json`)).currentCallYear,2026);}finally{rmSync(root,{recursive:true,force:true});}
});
