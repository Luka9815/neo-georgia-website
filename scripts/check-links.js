// Manual network audit only. Never imported by build, test or CI.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {load} from 'cheerio';
import {files} from '../lib/placeholders.js';
const references=new Map();
for(const file of files('_site').filter(p=>p.endsWith('.html'))){const $=load(readFileSync(file,'utf8'));for(const node of $('[href],[src]')){const value=$(node).attr('href')||$(node).attr('src');if(!/^https?:\/\//.test(value))continue;const url=new URL(value);url.hash='';if(!references.has(url.href))references.set(url.href,new Set());references.get(url.href).add(file.slice(6));}}
const rows=[];const queue=[...references];const blocked=new Map();
async function request(url,method){const response=await fetch(url,{method,redirect:'follow',signal:AbortSignal.timeout(8000),headers:{'User-Agent':'NEOGeorgiaWebsite-LinkAudit/Session24'}});return response;}
await Promise.all(Array.from({length:6},async()=>{while(queue.length){const [url,pages]=queue.shift();let status;let target='';const host=new URL(url).host;
 if(blocked.has(host))status='Not requested: host blocked by proxy in this run ('+blocked.get(host)+')';
 else try{let response;try{response=await request(url,'HEAD');}catch{response=await request(url,'GET');}if(!response.ok)response=await request(url,'GET');status=String(response.status);target=response.url!==url?response.url:'';
 if(response.status===403){const body=await response.text();if(/proxy|denied|blocked|policy|forbidden/i.test(body)){status='403: outbound proxy/policy denial';blocked.set(host,status);}}
 }catch(error){status=`Not verified: ${error.cause?.code||error.name}: ${error.message}${error.cause?.message?' ('+error.cause.message+')':''}`;if(/proxy|ECONNREFUSED/i.test(status))blocked.set(host,status);}
 rows.push({url,pages:[...pages].sort(),status,target});if(rows.length%100===0)console.log(`Links: ${rows.length}/${references.size}`);
}}));
rows.sort((a,b)=>a.url.localeCompare(b.url));mkdirSync('docs/review/session-24',{recursive:true});
writeFileSync('docs/review/session-24/links.json',JSON.stringify(rows,null,2)+'\n');
writeFileSync('docs/review/session-24/LINKS.md','# External links, 2026-10-29\n\nManual built-site audit: HEAD, GET fallback, 8-second timeout, six workers, redirects followed. URL fragments are removed and duplicate URLs share their source-page list. Proxy/policy denials and transport failures are unverified links, not broken-source findings. Once a host is explicitly denied, remaining URLs on that host are recorded as not requested. Full page lists are in links.json. Run NODE_USE_ENV_PROXY=1 npm run check:links after a clean build. This command is outside CI/build.\n\n| URL | Pages | Status | Redirect target |\n| --- | --- | --- | --- |\n'+rows.map(r=>`| ${r.url} | ${r.pages.length>8?r.pages.slice(0,8).join(', ')+` (+${r.pages.length-8}, see links.json)`:r.pages.join(', ')} | ${r.status.replaceAll('|','/')} | ${r.target} |`).join('\n')+'\n');
console.log(`${rows.length} URLs inventoried; ${rows.filter(r=>/^2\d\d$/.test(r.status)).length} successful responses. See LINKS.md for unverified requests.`);
