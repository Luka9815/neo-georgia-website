// Requires an external Lighthouse installation, never a site dependency.
import {writeFile, mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root = process.env.LIGHTHOUSE_ROOT;
if (!root) throw new Error('Set LIGHTHOUSE_ROOT to a local Lighthouse node_modules directory');
const {default:lighthouse} = await import(pathToFileURL(`${root}/lighthouse/core/index.js`));
const {launch} = await import(pathToFileURL(`${root}/chrome-launcher/dist/index.js`));
const phase = process.env.REVIEW_PHASE || 'after';
const base = process.env.TEST_URL || 'http://127.0.0.1:8141';
const records = [];
for (const lang of ['ka','en']) for (const [page,path] of [['home',''],['action','opportunities/cbhe/'],['statistics','resources/statistics/']]) {
  const chrome = await launch({chromePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
  try {
    const {lhr} = await lighthouse(`${base}/${lang}/${path}`, {port:chrome.port, onlyCategories:['performance','accessibility'], logLevel:'error'});
    if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError));
    const transfer = lhr.audits['network-requests'].details.items.reduce((n,item)=>n+(item.transferSize||0),0);
    records.push({page,lang,url:lhr.finalDisplayedUrl,version:lhr.lighthouseVersion,performance:Math.round(lhr.categories.performance.score*100),accessibility:Math.round(lhr.categories.accessibility.score*100),transferBytes:transfer,lcpMs:Math.round(lhr.audits['largest-contentful-paint'].numericValue),cls:lhr.audits['cumulative-layout-shift'].numericValue,failedAudits:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,score:a.score,displayValue:a.displayValue}))});
    console.log(JSON.stringify(records.at(-1)));
  } finally { await chrome.kill(); }
}
await mkdir(`docs/review/session-21/${phase}`,{recursive:true});
await writeFile(`docs/review/session-21/${phase}/lighthouse.json`,JSON.stringify({date:'2026-10-29',method:'Lighthouse default simulated mobile throttling, cold navigation, one run per page; local uncompressed HTTP server',records},null,2)+'\n');
