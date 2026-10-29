import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {serveFixtureSite} from './fixture-site.js';
const phase=process.env.REVIEW_PHASE||'after';
const out=`docs/review/session-25/${phase}`;
await mkdir(out,{recursive:true});
const server=await serveFixtureSite(process.env.REVIEW_ROOT||process.cwd());
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const rows=[];
try {
 const page=await browser.newPage();
 // Suppress only refresh navigation in the screenshot response, so the stub is visible.
 await page.route('**/*',async route=>{
  if(route.request().resourceType()!=='document')return route.continue();
  const response=await route.fetch();
  const body=(await response.text()).replace(/<meta\s+http-equiv="refresh"[^>]*>/gi,'');
  await route.fulfill({response,body});
 });
 for(const lang of ['ka','en'])for(const width of [390,1280])for(const [name,path]of Object.entries({contact:`/${lang}/about/contact/`,team:`/${lang}/about/team/`,hereStub:`/${lang}/here/`,legacyStub:'/contact/',credits:`/${lang}/about/credits/`,footer:`/${lang}/about/contact/`})){
  await page.setViewportSize({width,height:900});
  const response=await page.goto(server.base+path);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
  const file=`${name}-${lang}-${width}.png`;
  if(name==='footer')await page.locator('footer').screenshot({path:`${out}/${file}`});
  else await page.screenshot({path:`${out}/${file}`,fullPage:true});
  rows.push({lang,width,path,status:response.status(),htmlLang:await page.locator('html').getAttribute('lang'),file});
 }
 await writeFile(`${out}/screenshots.json`,JSON.stringify(rows,null,2)+'\n');
}finally{await browser.close();await server.close();}
console.log(`${phase}: ${rows.length} captures`);
