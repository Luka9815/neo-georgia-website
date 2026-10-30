// Visual evidence only, outside builds/tests/deployment.
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {serveFixtureSite} from './fixture-site.js';
import assert from 'node:assert/strict';
const phase=process.env.REVIEW_PHASE||'after',out=`docs/review/session-27/${phase}`;
await mkdir(out,{recursive:true});
const server=await serveFixtureSite(process.env.REVIEW_ROOT||process.cwd());
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const rows=[];
try {
 const context=await browser.newContext();const page=await context.newPage();
 async function visit(path){const r=await page.goto(server.base+path);assert.equal(r.status(),200);await page.evaluate(()=>document.fonts.ready);await page.evaluate(async()=>{for(const i of document.images){i.loading='eager';await i.decode();}});await page.waitForTimeout(300);}
 async function capture(name,lang,width,element){await page.waitForFunction(()=>document.querySelector('.site-header').getAnimations({subtree:true}).length===0,null,{polling:50,timeout:10000});const file=`${name}-${lang}-${width}.png`;if(element)await element.screenshot({path:`${out}/${file}`});else await page.screenshot({path:`${out}/${file}`});rows.push({name,lang,width,file,scrollY:await page.evaluate(()=>scrollY),compact:await page.locator('.site-header').getAttribute('data-compact')!==null,creditControl:await page.locator('.photo-credit-control').count()});}
 for(const lang of ['ka','en'])for(const width of [390,1280]) {
  await page.setViewportSize({width,height:900});await visit(`/${lang}/`);await capture('home-top',lang,width);
  await page.evaluate(()=>scrollTo(0,380));await page.waitForTimeout(350);await capture('home-scrolled',lang,width);
  await visit(`/${lang}/`);await page.locator(width>=1024?'.desktop-navigation a':'.search-link').nth(width>=1024?1:0).hover();await page.waitForTimeout(300);await capture('hover',lang,width);
  await visit(`/${lang}/opportunities/cbhe/`);await capture('action',lang,width);
  await visit(`/${lang}/find/university/`);await capture('university',lang,width);
  await visit(`/${lang}/about/`);
  const control=page.locator('.photo-credit-control');
  if(await control.count()){await control.locator('summary').click();await control.locator('.photo-credit-panel').scrollIntoViewIfNeeded();}
  else await page.locator('.portal-photo figcaption').scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);await capture('credit-open',lang,width);
  await page.setViewportSize({width,height:1200});await visit(`/${lang}/`);await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(350);await capture('footer',lang,width,page.locator('footer'));
 }
 await writeFile(`${out}/screenshots.json`,JSON.stringify(rows,null,2)+'\n');
}finally{await browser.close();await server.close();}
console.log(`${phase}: ${rows.length} requested captures`);
