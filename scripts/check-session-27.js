import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {serveFixtureSite} from './fixture-site.js';
import {getPathPrefix} from '../lib/urls.js';
import {pathToFileURL} from 'node:url';

export async function checkSession27(browser,base,prefix='/',credits=true) {
 const rows=[];let axePages=0;
 const pause=async page=>{
  await page.waitForTimeout(500);
  await page.waitForFunction(()=>{const h=document.querySelector('.site-header'),key=h.hasAttribute('data-compact')?'--header-h-compact':'--header-h',value=document.documentElement.style.getPropertyValue(key);return h.getAnimations({subtree:true}).length===0&&(!value||Math.abs(parseFloat(value)-h.getBoundingClientRect().height)<1);},null,{polling:50,timeout:10000});
 };
 for(const javaScriptEnabled of [false,true]) {
  const context=await browser.newContext({javaScriptEnabled,viewport:{width:390,height:900}});
  const page=await context.newPage();
  async function visit(lang,path=''){await page.goto(`${base}${prefix}${lang}/${path}`);await page.evaluate(()=>document.fonts.ready);await page.locator('.eu-emblem').scrollIntoViewIfNeeded();await page.locator('.eu-emblem').evaluate(e=>e.decode());await page.evaluate(()=>scrollTo(0,0));await pause(page);}
  try {
   for(const width of [320,390,1024,1280,1920])for(const lang of ['ka','en']) {
    console.log(`Header ${javaScriptEnabled}/${width}/${lang}`);await page.setViewportSize({width,height:900});await visit(lang);
    const full=await page.locator('.site-header').evaluate(e=>e.getBoundingClientRect().height);
    const name=lang==='ka'?'English':'ქართული';const switcher=page.locator('header a[hreflang]');
    assert.equal((await switcher.textContent()).trim(),name);
    assert.equal(await switcher.getAttribute('aria-label'),lang==='ka'?'English: switch language':'ქართული: ენის შეცვლა');
    for(const selector of ['.language-switch','.search-link',...(width<1024?['.mobile-menu summary']:[])]) {
     const b=await page.locator(selector).boundingBox();assert.ok(b.width>=44&&b.height>=44,`${selector} target ${lang}/${width}`);
    }
    const metrics=await page.evaluate(()=>{const r=s=>{const b=document.querySelector(s).getBoundingClientRect();return {width:b.width,height:b.height};};return {brand:r('.brand'),emblem:r('.eu-emblem'),overflow:document.documentElement.scrollWidth>innerWidth};});
    assert.ok(!metrics.overflow);assert.ok(metrics.brand.width<=metrics.emblem.width&&metrics.brand.height<=metrics.emblem.height,JSON.stringify({width,lang,...metrics}));
    const flagHeight=metrics.emblem.width*788/(lang==='ka'?4246:4125);assert.ok(flagHeight>=38,`${lang}/${width}: flag ${flagHeight}`);
    await page.evaluate(()=>scrollTo(0,400));await pause(page);
    const compact=await page.locator('.site-header').evaluate(e=>({height:e.getBoundingClientRect().height,state:e.hasAttribute('data-compact')}));
    if(javaScriptEnabled) {
     assert.ok(compact.state&&compact.height<full,JSON.stringify({lang,width,full,compact}));
     await page.evaluate(()=>scrollTo(0,60));await pause(page);assert.ok(await page.locator('[data-compact]').count());
     await page.evaluate(()=>scrollTo(0,10));await pause(page);assert.equal(await page.locator('[data-compact]').count(),0);
     await page.evaluate(()=>scrollTo(0,60));await pause(page);assert.equal(await page.locator('[data-compact]').count(),0);
     await page.evaluate(()=>scrollTo(0,400));await pause(page);await page.reload();await pause(page);assert.ok(await page.locator('[data-compact]').count(),'mid-page reload');
    } else {assert.equal(compact.state,false);assert.equal(compact.height,full);}
    rows.push({javaScriptEnabled,width,lang,fullHeight:full,compactHeight:compact.height,flagHeight,...metrics});
    if(width>=1024) {
     await visit(lang,'opportunities/cbhe/');await page.evaluate(()=>scrollTo(0,800));await pause(page);
     const facts=await page.evaluate(()=>{const h=document.querySelector('.site-header').getBoundingClientRect(),f=document.querySelector('.action-facts').getBoundingClientRect();return {gap:f.top-h.bottom,height:f.height,viewport:innerHeight};});
     assert.ok(facts.gap>=0,JSON.stringify(facts));if(javaScriptEnabled)assert.ok(facts.gap<=35,JSON.stringify(facts));
    }
   }
   if(credits)for(const width of [320,390,1280])for(const lang of ['ka','en'])for(const path of ['', 'about/','find/student/','find/university/','find/youth/','find/vet/','find/sport/','opportunities/']) {
    console.log(`Credit ${javaScriptEnabled}/${width}/${lang}/${path}`);await page.setViewportSize({width,height:900});await visit(lang,path);
    if(path==='find/university/'){assert.equal(await page.locator('.portal-photo').count(),0);continue;}
    const details=page.locator('.photo-credit-control');assert.equal(await details.count(),1);
    const summary=details.locator('summary');await summary.scrollIntoViewIfNeeded();await pause(page);await summary.focus();await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'),'');const panel=details.locator('.photo-credit-panel');await panel.scrollIntoViewIfNeeded();
    assert.ok(await panel.isVisible());const box=await panel.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width);
    assert.ok(await panel.locator('a[rel=license]').count());
    if(path==='') {
     const overlaps=await panel.evaluate(el=>{const a=el.getBoundingClientRect();return [...document.querySelectorAll('.hero-main h1,.hero-main .entry')].some(e=>{const b=e.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});});
     assert.equal(overlaps,false,`Home credit overlap: ${lang}/${width}`);
    }
    if(javaScriptEnabled){const result=await new AxeBuilder({page}).options({resultTypes:['violations']}).analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${lang}/${path}, ${width}`);axePages++;}
    await summary.focus();await page.keyboard.press('Space');assert.equal(await details.getAttribute('open'),null);
   }
   await page.setViewportSize({width:1280,height:900});
   await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});await visit('ka');await page.evaluate(()=>scrollTo(0,400));await pause(page);
   assert.equal(await page.locator('.brand').evaluate(e=>getComputedStyle(e).transform),'none');
   assert.equal(await page.locator('.site-header').evaluate(e=>getComputedStyle(e).backdropFilter),'none');
   const summary=page.locator('.photo-credit-control summary');await summary.focus();await page.keyboard.press('Enter');assert.ok(await page.locator('.photo-credit-panel').isVisible());
   await page.emulateMedia({media:'print',forcedColors:'none'});
   assert.equal(await page.locator('.site-header').evaluate(e=>getComputedStyle(e).position),'static');
   assert.equal(await page.locator('.brand').evaluate(e=>getComputedStyle(e).transform),'none');
  }finally{await context.close();}
 }
 return {rows,axePages};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
 const prefix=getPathPrefix();const server=await serveFixtureSite(process.cwd(),prefix);
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try {const result=await checkSession27(browser,server.base,prefix,process.env.REVIEW_PART!=='header');await mkdir('docs/review/session-27',{recursive:true});await writeFile(`docs/review/session-27/browser-${prefix==='/'?'root':'prefix'}${process.env.REVIEW_PART==='header'?'-header':''}.json`,JSON.stringify(result,null,2)+'\n');console.log(`Session 27: ${result.rows.length} header/flag states and ${result.axePages} open-credit axe views passed.`);}
 finally{await browser.close();await server.close();}
}
