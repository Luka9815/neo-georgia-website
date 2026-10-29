// Browser invariants for surfaces staff may change through Pages CMS.
import assert from 'node:assert/strict';
import {loadContent} from '../lib/content.js';
export async function checkEditableSurfaces(browser,base,prefix){
 const content=loadContent();const page=await browser.newPage({viewport:{width:320,height:800}});
 try{
 for(const lang of ['ka','en']){
  const url=`${base}${prefix}${lang}/resources/publications/`;const publications=content.publication.filter(item=>item[lang]);await page.goto(url);const visible=page.locator('[data-publications] > li:not(.empty-state):visible');assert.equal(await visible.count(),publications.length);
  if(publications.length){
   const selectedYear=String(publications[0].year);await page.locator('#publication-year').selectOption(selectedYear);assert.equal(await visible.count(),publications.filter(p=>String(p.year)===selectedYear).length);
   const types=await page.locator('#publication-type option').evaluateAll(els=>els.map(e=>e.value).filter(Boolean));const selectedType=types.find(type=>!publications.some(p=>String(p.year)===selectedYear&&p.type===type))||types[0];
   if(selectedType){await page.locator('#publication-type').selectOption(selectedType);const expected=publications.filter(p=>String(p.year)===selectedYear&&p.type===selectedType).length;assert.equal(await visible.count(),expected);assert.match(await page.locator('[role=status]').textContent(),new RegExp(`${expected}$`));}
   await page.locator('button[type=reset]').click();await page.waitForFunction(()=>[...document.querySelectorAll('[data-publications] > li')].every(item=>!item.hidden));assert.equal(await visible.count(),publications.length);
  }
  const noJs=await browser.newContext({javaScriptEnabled:false});const document=await noJs.newPage();await document.goto(url);assert.equal(await document.locator('[data-publications] > li:not(.empty-state):visible').count(),publications.length);assert.equal(await document.locator('[data-publication-filters]').isVisible(),false);await noJs.close();
  const news=content.news.filter(item=>item[lang]);for(const suffix of ['news/',...news.filter(item=>item.image).map(item=>`news/${item.slug}/`)]){
   await page.goto(`${base}${prefix}${lang}/${suffix}`);const images=page.locator('main picture img.news-image');assert.equal(await images.count(),suffix==='news/'?news.filter(item=>item.image).length:1);
   for(const image of await images.all()){await image.scrollIntoViewIfNeeded();await image.evaluate(image=>image.decode());assert.ok(await image.evaluate(image=>image.naturalWidth>0));}
  }
  const native=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const listing=await native.newPage();await listing.goto(`${base}${prefix}${lang}/opportunities/`);const cards=listing.locator('.cards-action > li');assert.equal(await cards.count(),content.action.reduce((n,item)=>n+item.sectors.length,0));for(const card of await cards.all())assert.ok(await card.locator('.action-key-label').isVisible());await native.close();
 }
 }finally{await page.close();}
 console.log('Editable surfaces: current Publication counts/filters/no-JS, every News image decode, and Action sector labels passed in both languages.');
}
