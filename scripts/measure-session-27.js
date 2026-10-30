// Serial local audits using an external installation, never build/test/CI.
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {serveFixtureSite} from './fixture-site.js';
const phase=process.env.REVIEW_PHASE||'after';
const root=process.env.LIGHTHOUSE_ROOT||'/tmp/neo27-audit/node_modules';
const {default:lighthouse}=await import(pathToFileURL(`${root}/lighthouse/core/index.js`));
const {launch}=await import(pathToFileURL(`${root}/chrome-launcher/dist/index.js`));
const server=await serveFixtureSite(process.env.REVIEW_ROOT||process.cwd());
const out=`docs/review/session-27/${phase}`;await mkdir(out,{recursive:true});const rows=[];
try{for(const formFactor of ['mobile','desktop'])for(const lang of ['ka','en'])for(const route of ['', 'opportunities/','opportunities/cbhe/','calls/','news/neo-dissemination-event-2025/','about/']){
 if((process.env.LIGHTHOUSE_ROUTE&&process.env.LIGHTHOUSE_ROUTE!==route)||(process.env.LIGHTHOUSE_LANG&&process.env.LIGHTHOUSE_LANG!==lang)||(process.env.LIGHTHOUSE_DEVICE&&process.env.LIGHTHOUSE_DEVICE!==formFactor))continue;
 const chrome=await launch({chromePath:'/usr/bin/chromium',chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
 try{
 const {lhr}=await lighthouse(`${server.base}/${lang}/${route}`,{port:chrome.port,onlyCategories:['performance','accessibility'],logLevel:'error'},formFactor==='desktop'?{extends:'lighthouse:default',settings:{formFactor:'desktop',screenEmulation:{mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}}:undefined);
 if(process.env.SAVE_LHR)await writeFile(`${out}/${formFactor}-${lang}-${route.replaceAll('/','-')||'home'}-full.json`,JSON.stringify(lhr,null,2)+'\n');
 const row={formFactor,lang,route,version:lhr.lighthouseVersion,performance:Math.round(lhr.categories.performance.score*100),accessibility:Math.round(lhr.categories.accessibility.score*100),audits:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,score:a.score,displayValue:a.displayValue}))};rows.push(row);console.log(JSON.stringify(row));await writeFile(`${out}/lighthouse.json`,JSON.stringify(rows,null,2)+'\n');
 }finally{await chrome.kill();}
}}finally{await server.close();}
