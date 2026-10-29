// Focused photo checks supplement the complete site/fixture accessibility sweep.
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {getPathPrefix} from '../lib/urls.js';
const prefix=getPathPrefix();const base=process.env.TEST_URL || 'http://127.0.0.1:8141';
const paths=['','about/','find/student/','find/university/','find/youth/','find/vet/','find/sport/','opportunities/'];
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
try {
 for(const javaScriptEnabled of [false,true]) for(const width of [390,1280]) {
  const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled});
  const page=await context.newPage();const originalRequests=[];
  page.on('request',request=>{if(request.url().includes('/assets/images/source/'))originalRequests.push(request.url());});
  for(const lang of ['ka','en'])for(const path of paths){
   console.log(`Photo check: ${lang}/${path}, ${width}px, JS ${javaScriptEnabled}`);
   await page.goto(`${base}${prefix}${lang}/${path}`);await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const figure=page.locator('figure.portal-photo');assert.equal(await figure.count(),1);
   const image=figure.locator('img');await image.evaluate(el=>el.decode());
   assert.ok(await image.evaluate(el=>el.naturalWidth>=320 && el.getBoundingClientRect().height>180));
   const credit=figure.locator('[data-photo-credit]');assert.equal(await credit.count(),1);
   const licence=credit.locator('a[rel=license]');await licence.scrollIntoViewIfNeeded();await licence.focus();
   assert.equal(await licence.evaluate(el=>el===document.activeElement),true);
   assert.notEqual(await licence.evaluate(el=>getComputedStyle(el).outlineStyle),'none');
   assert.equal(await credit.locator('a[href^="https://commons.wikimedia.org/wiki/File:"]').count(),1);
   if(path===''){
    assert.ok(await page.locator('.home-hero :is(h1,.eyebrow,.hero-intro)').evaluateAll(els=>els.every(el=>getComputedStyle(el).color==='rgb(255, 255, 255)')));
    const entryBottom=await page.locator('.hero-main .entry').evaluate(el=>el.getBoundingClientRect().bottom);
    assert.ok(await credit.evaluate((el,bottom)=>el.getBoundingClientRect().top>=bottom+8,entryBottom),'Hero credit must not cover the buttons');
   }
   if(javaScriptEnabled) {
   const result=await new AxeBuilder({page}).options({resultTypes:['violations']}).analyze();
   assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${lang}/${path}, ${width}px`);
   }
  }
  for(const lang of ['ka','en']) for(const path of ['news/','news/neo-dissemination-event-2025/']) {
   await page.goto(`${base}${prefix}${lang}/${path}`);await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.ok(await page.locator('[data-news-photo-credit],[data-photo-credit="dissemination"]').isVisible());
   if(javaScriptEnabled) {
    const result=await new AxeBuilder({page}).options({resultTypes:['violations']}).analyze();
    assert.deepEqual(result.violations,[],`${lang}/${path}, ${width}px`);
   }
  }
  assert.deepEqual(originalRequests,[]);await context.close();
 }
 console.log('Session 23: 80 bilingual 390/1280px photo/News checks (40 with axe, 40 without JavaScript) pass credit focus, decoded dimensions, no source requests, no overflow and Home contrast/credit layout checks.');
} finally {await browser.close();}
