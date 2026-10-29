// Requires an external Lighthouse installation, never a site dependency.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile, mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root = process.env.LIGHTHOUSE_ROOT;
if (!root) throw new Error('Set LIGHTHOUSE_ROOT to a local Lighthouse node_modules directory');
const {default:lighthouse} = await import(pathToFileURL(`${root}/lighthouse/core/index.js`));
const {launch} = await import(pathToFileURL(`${root}/chrome-launcher/dist/index.js`));
const phase = process.env.REVIEW_PHASE || 'after';
const base = process.env.TEST_URL || 'http://127.0.0.1:8141';
const records = [];
for (const lang of ['ka','en']) for (const [page,path] of [['home',''],['action','opportunities/cbhe/'],['statistics','resources/statistics/'],['find','find/student/']]) {
  const chrome = await launch({chromePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
  try {
    const {lhr} = await lighthouse(`${base}/${lang}/${path}`, {port:chrome.port, onlyCategories:['performance','accessibility'], logLevel:'error'});
    if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError));
    const transfer = lhr.audits['network-requests'].details.items.reduce((n,item)=>n+(item.transferSize||0),0);
    records.push({page,lang,url:lhr.finalDisplayedUrl,version:lhr.lighthouseVersion,performance:Math.round(lhr.categories.performance.score*100),accessibility:Math.round(lhr.categories.accessibility.score*100),transferBytes:transfer,lcpMs:Math.round(lhr.audits['largest-contentful-paint'].numericValue),cls:lhr.audits['cumulative-layout-shift'].numericValue,failedAudits:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,score:a.score,displayValue:a.displayValue}))});
    console.log(JSON.stringify(records.at(-1)));
  } finally { await chrome.kill(); }
}
const fullHomeTransfers=[];
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
try {
 for(const lang of ['ka','en']) {
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,javaScriptEnabled:false});
  const page=await context.newPage();const session=await context.newCDPSession(page);
  await session.send('Network.enable');await session.send('Network.setCacheDisabled',{cacheDisabled:true});
  let bytes=0;session.on('Network.loadingFinished',event=>bytes+=event.encodedDataLength);
  await page.goto(`${base}/${lang}/`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async image=>{image.loading='eager';await image.decode().catch(()=>{});}));});
  await page.waitForLoadState('networkidle');
  fullHomeTransfers.push({lang,width:390,dpr:2,bytes,method:'Cold Chromium, JS disabled, all images forced eager including News and EU footer, CDP encodedDataLength'});
  assert.ok(bytes<500000,`${lang} full Home transfer ${bytes}`);
  await context.close();
 }
} finally {await browser.close();}
await mkdir(`docs/review/session-22/${phase}`,{recursive:true});
await writeFile(`docs/review/session-22/${phase}/lighthouse.json`,JSON.stringify({date:'2026-10-29',method:'Lighthouse default simulated mobile throttling, cold navigation, one run per page; local uncompressed HTTP server',records,fullHomeTransfers},null,2)+'\n');

for(const row of records){assert.ok(row.performance>=90,JSON.stringify(row));assert.equal(row.accessibility,100,JSON.stringify(row));}
