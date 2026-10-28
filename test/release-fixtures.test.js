import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,rmSync} from 'node:fs';
import {load} from 'cheerio';
import {createFixtureSite,buildFixtureSite} from '../scripts/fixture-site.js';
import {loadContent,eventStatus} from '../lib/content.js';
import {getPathPrefix} from '../lib/urls.js';
test('isolated sample content retains mixed home, Action relationships and generated per-Event ICS coverage',()=>{
 const root=createFixtureSite();const prefix=getPathPrefix();
 try {
  buildFixtureSite(root,prefix);const data=loadContent(`${root}/src/content`);
  for(const lang of ['ka','en']){
   const home=load(readFileSync(`${root}/_site/${lang}/index.html`,'utf8'));
   assert.equal(home('main > section').length,6);
   for(const type of ['call','event','news']){
    const count=home(`.cards-${type} > .card:not(.empty-state)`).length;
    assert.ok(count>0);assert.equal(home(`.cards-${type} .card-section-label`).length,count);
   }
   const action=load(readFileSync(`${root}/_site/${lang}/opportunities/cbhe/index.html`,'utf8'));
   assert.equal(action('main > section').length,8);
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
