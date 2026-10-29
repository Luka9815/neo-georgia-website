// External audit installation only; serial mobile Lighthouse, outside CI/build.
import {writeFile,mkdir} from 'node:fs/promises';import {pathToFileURL} from 'node:url';
const root=process.env.LIGHTHOUSE_ROOT;if(!root)throw Error('Set LIGHTHOUSE_ROOT to an external node_modules directory');
const {default:lighthouse}=await import(pathToFileURL(`${root}/lighthouse/core/index.js`));const {launch}=await import(pathToFileURL(`${root}/chrome-launcher/dist/index.js`));
const base=process.env.TEST_URL||'http://127.0.0.1:8142';
const routes={home:'',opportunities:'opportunities/',action:'opportunities/cbhe/',calls:'calls/',events:'events/',news:'news/',article:'news/neo-dissemination-event-2025/',resources:'resources/',publications:'resources/publications/',faq:'resources/faq/',statistics:'resources/statistics/',about:'about/',team:'about/team/',here:'about/here/',contact:'about/contact/',search:'search/',notFound:'../404.html'};
const records=[];await mkdir('docs/review/session-24',{recursive:true});
for(const lang of ['ka','en'])for(const [page,path]of Object.entries(routes)){
 const chrome=await launch({chromePath:'/usr/bin/chromium',chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
 try{const url=page==='notFound'?`${base}/404.html${lang==='en'?'#not-found-en':''}`:`${base}/${lang}/${path}`;const {lhr}=await lighthouse(url,{port:chrome.port,onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'});
 const row={page,lang,url:lhr.finalDisplayedUrl,version:lhr.lighthouseVersion,runtimeError:lhr.runtimeError,scores:Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)])),failedAudits:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,score:a.score,displayValue:a.displayValue,title:a.title}))};records.push(row);console.log(JSON.stringify(row));
 await writeFile('docs/review/session-24/lighthouse.json',JSON.stringify(records,null,2)+'\n');
 }finally{await chrome.kill();}
}
await writeFile('docs/review/session-24/LIGHTHOUSE.md','# Mobile Lighthouse, 2026-10-29\n\nLighthouse default simulated mobile, one cold local run per template/language, four categories, serially through LIGHTHOUSE_ROOT. Local uncompressed HTTP, not hosted performance. The shared bilingual 404 is audited twice using its English anchor for the second run. Preview/noindex intentionally limits SEO; no launch switch is enabled for these production-preview audits. Raw per-audit findings are in lighthouse.json and raw/lighthouse.log.\n\n| Page | Language | Performance | Accessibility | Best practices | SEO |\n| --- | --- | ---: | ---: | ---: | ---: |\n'+records.map(r=>`| ${r.page} | ${r.lang} | ${r.scores.performance} | ${r.scores.accessibility} | ${r.scores['best-practices']} | ${r.scores.seo} |`).join('\n')+'\n');
