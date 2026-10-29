// External pixel tools only, no build/test/CI dependency.
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=process.env.LIGHTHOUSE_ROOT||'/tmp/neo26-audit/node_modules';
const {PNG}=await import(pathToFileURL(`${root}/pngjs/lib/png.js`));
const {default:pixelmatch}=await import(pathToFileURL(`${root}/pixelmatch/index.js`));
const dir='docs/review/session-26';const rows=JSON.parse(readFileSync(`${dir}/before/screenshots.json`));const results=[];
for(const row of rows){
 const a=PNG.sync.read(readFileSync(`${dir}/before/${row.file}`));const b=PNG.sync.read(readFileSync(`${dir}/consolidated/${row.file}`));const height=Math.min(a.height,b.height);
 assert.equal(a.width,b.width,row.file);
 const differences=pixelmatch(a.data.subarray(0,a.width*height*4),b.data.subarray(0,b.width*height*4),null,a.width,height,{threshold:.1});
 results.push({file:row.file,differences,width:a.width,height:a.height,afterHeight:b.height});
 assert.ok(Math.abs(a.height-b.height)<=1&&differences/(a.width*height)<=.005,row.file);
}
writeFileSync(`${dir}/consolidation-diff.json`,JSON.stringify(results,null,2)+'\n');console.log(`${results.length} captures pass; ${results.filter(r=>r.differences===0).length} match exactly.`);
