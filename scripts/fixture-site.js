// Isolated test content only. Never imported by the production build.
import { cpSync, mkdirSync, mkdtempSync, symlinkSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
export function createFixtureSite(types = ['event', 'call', 'resource', 'story']) {
 const root=mkdtempSync(join(tmpdir(),'neo-content-fixtures-'));
 for(const path of ['src','lib','eleventy.config.js','package.json'])cpSync(path,join(root,path),{recursive:true});
 for(const type of types)cpSync(`test/fixtures/release-content/${type}`,join(root,`src/content/${type}`),{recursive:true});
 mkdirSync(join(root,'migration/source'),{recursive:true});
 cpSync('test/fixtures/projects-snapshot.json',join(root,'migration/source/erasmus-projects-georgia-2026-10-28.json'));
 symlinkSync(resolve('node_modules'),join(root,'node_modules'),'dir');
 return root;
}
export function buildFixtureSite(root,prefix='/') {
 execFileSync(process.execPath,['node_modules/@11ty/eleventy/cmd.cjs'],{cwd:root,env:{...process.env,PATH_PREFIX:prefix,SITE_URL:`https://example.org${prefix}`},stdio:'pipe'});
}
export async function serveFixtureSite(root,prefix='/') {
 const output=join(root,'_site');
 const server=createServer((request,response)=>{
  try {
   const path=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
   if(!path.startsWith(prefix))throw new Error('prefix');
   let file=resolve(output,path.slice(prefix.length));
   if(!file.startsWith(output+'/') && file!==output)throw new Error('path');
   if(statSync(file).isDirectory())file=join(file,'index.html');
   const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.ics':'text/calendar; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml','.avif':'image/avif','.webp':'image/webp'};
   response.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});response.end(readFileSync(file));
  }catch {response.writeHead(404);response.end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 return {base:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(done=>server.close(done))};
}
