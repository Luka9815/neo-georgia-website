// Manual network audit only. Never imported by build or CI.
import {readFileSync,mkdirSync,writeFileSync,appendFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {randomInt} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {load} from 'cheerio';
import {files} from '../lib/placeholders.js';
import {siteUrl} from '../lib/urls.js';

export function selectLinks(references, generated, sampleSize=200, draw=randomInt){
 if(!Number.isSafeInteger(sampleSize)||sampleSize<0)throw new Error('PROJECT_SAMPLE_SIZE must be a non-negative integer');
 const handEntered=[...references].filter(([url])=>!generated.has(url));
 const projects=[...references].filter(([url])=>generated.has(url));
 for(let i=projects.length-1;i>0;i--){const j=draw(i+1);[projects[i],projects[j]]=[projects[j],projects[i]];}
 return {handEntered,projects:projects.slice(0,sampleSize),generatedTotal:projects.length};
}

export async function auditLinks(){
 const references=new Map();const ownOrigin=new URL(siteUrl()).origin;
 for(const file of files('_site').filter(p=>p.endsWith('.html'))){
  const $=load(readFileSync(file,'utf8'));
  for(const node of $('[href],[src]')){
   const value=$(node).attr('href')||$(node).attr('src');if(!/^https?:\/\//.test(value))continue;
   const url=new URL(value);url.hash='';if(url.origin===ownOrigin)continue;
   if(!references.has(url.href))references.set(url.href,new Set());references.get(url.href).add(file.slice(6));
  }
 }
 const snapshot=JSON.parse(readFileSync('migration/source/erasmus-projects-georgia-2026-10-28.json','utf8'));
 const generated=new Set(snapshot.projects.map(project=>project.cardUrl));
 // An explicitly authored project URL must still be checked on every run.
 for(const file of files('src').filter(p=>/\.(json|njk|md)$/.test(p))){const text=readFileSync(file,'utf8');for(const url of text.match(/https?:\/\/[^\s"<>\)]+/g)||[])generated.delete(url);}
 const selected=selectLinks(references,generated,Number(process.env.PROJECT_SAMPLE_SIZE??200));
 const out=process.env.LINK_AUDIT_DIR||'docs/review/session-25/link-audit';mkdirSync(out,{recursive:true});
 const queue=[...selected.handEntered.map(([url,pages])=>({url,pages,kind:'hand-entered'})),...selected.projects.map(([url,pages])=>({url,pages,kind:'generated-project'}))];
 writeFileSync(`${out}/inventory.json`,JSON.stringify({date:new Date().toISOString(),handEntered:selected.handEntered.length,generatedTotal:selected.generatedTotal,sampledProjects:selected.projects.length,selected:queue.map(({url,kind})=>({url,kind}))},null,2)+'\n');
 writeFileSync(`${out}/results.jsonl`,'');
 let lastErasmusRequest=0;
 const erasmusDelay=Number(process.env.ERASMUS_DELAY_MS??500);
 if(!Number.isFinite(erasmusDelay)||erasmusDelay<0)throw new Error('ERASMUS_DELAY_MS must be non-negative');
 async function request(url,method){
  if(new URL(url).hostname==='erasmus-plus.ec.europa.eu'){
   await delay(Math.max(0,lastErasmusRequest+erasmusDelay-Date.now()));lastErasmusRequest=Date.now();
  }
  const response=await fetch(url,{method,redirect:'follow',signal:AbortSignal.timeout(8000),headers:{'User-Agent':'NEOGeorgiaWebsite-LinkAudit/Session25'}});
  return response;
 }
 const rows=[];
 // Serial requests enforce the host delay, including fallback requests.
 for(const {url,pages,kind} of queue){
  let status,target='';
  try{
   let response;try{response=await request(url,'HEAD');}catch{response=await request(url,'GET');}
   if(!response.ok&&![429,403].includes(response.status)){await response.body?.cancel();response=await request(url,'GET');}
   status=String(response.status);target=response.url!==url?response.url:'';
   await response.body?.cancel();
  }catch(error){status=`Not verified: ${error.cause?.code||error.name}: ${error.message}`;}
  const row={url,kind,pages:[...pages].sort(),status,target};rows.push(row);
  appendFileSync(`${out}/results.jsonl`,JSON.stringify(row)+'\n');
  if(rows.length%25===0)console.log(`Links: ${rows.length}/${queue.length}`);
 }
 writeFileSync(`${out}/results.json`,JSON.stringify(rows,null,2)+'\n');
 console.log(`${rows.length} URLs checked: ${selected.handEntered.length} hand-entered and ${selected.projects.length}/${selected.generatedTotal} generated projects. Results saved incrementally in ${out}/results.jsonl.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await auditLinks();
