import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {load} from 'cheerio';
import {createFixtureSite,buildFixtureSite} from '../scripts/fixture-site.js';
import {loadOffice} from '../lib/office.js';
import getViews from '../src/_data/views.js';
const read=p=>readFileSync(p,'utf8');
function launchFixture(root){
 const settings=JSON.parse(read(join(root,'src/_data/settings.json')));settings.siteLaunched=true;writeFileSync(join(root,'src/_data/settings.json'),JSON.stringify(settings));
 const office=structuredClone(loadOffice());
 function fill(value,key=''){if(value==='[TBC]')return /email|Contact/i.test(key)?'office@example.org':key==='phone'?'+995 000 000 000':key==='ka'?'ანა':key==='en'?'ana':'000000';if(value&&typeof value==='object')for(const k of Object.keys(value))value[k]=fill(value[k],k);return value;}
 fill(office);writeFileSync(join(root,'src/_data/office.json'),JSON.stringify(office));
}
for(const prefix of ['/','/neo-georgia-website/'])test(`reviewed launch switch controls all indexable output at ${prefix}`,()=>{
 const root=createFixtureSite([]);
 try{
  launchFixture(root);buildFixtureSite(root,prefix);
  for(const view of getViews()){
   const file=join(root,'_site',view.path.endsWith('/')?view.path+'index.html':view.path);
   const $=load(read(file));assert.equal($('.preview-bar').length,0,file);
   assert.equal($('meta[name=robots]').attr('content'),view.target||view.kind==='404'?'noindex, nofollow':'index, follow',file);
  }
  assert.match(read(join(root,'_site/robots.txt')),/Allow: \//);assert.match(read(join(root,'_site/robots.txt')),new RegExp(`https://example.org${prefix}sitemap.xml`));
  const sitemap=load(read(join(root,'_site/sitemap.xml')),{xml:true});
  for(const row of sitemap('url')){const url=sitemap(row).find('loc').text();assert.ok(!url.endsWith('404.html'));assert.ok(sitemap(row).find('xhtml\\:link').length>=1);}
  assert.equal(sitemap('url').length,getViews().filter(v=>!v.target&&v.kind!=='404'&&!v.noindex).length);
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('launched build names the unresolved source file, JSON path and language',()=>{
 const root=createFixtureSite([]);try{launchFixture(root);const file=join(root,'src/_data/office.json');const office=JSON.parse(read(file));office.contact.address.ka='[TBC]';writeFileSync(file,JSON.stringify(office));assert.throws(()=>buildFixtureSite(root),error=>/src\/_data\/office.json: \$.contact.address.ka: ka: \[TBC\]/.test(`${error.stdout}\n${error.stderr}`));}finally{rmSync(root,{recursive:true,force:true});}
});
