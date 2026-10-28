import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(dir,entry.name)):[join(dir,entry.name)]).sort();
test('inventory every authored TBC by source file, field and occurrence without blocking review',()=>{
 const entries=[];
 function visit(file,value,field){
  if(typeof value==='string'){
   let occurrence=0;
   for(const match of value.matchAll(/\[TBC\]/g)) entries.push({file,field,occurrence:++occurrence,context:value.slice(Math.max(0,match.index-65),match.index+70).replace(/\s+/g,' ').replaceAll('|','\\|')});
  }else if(value&&typeof value==='object')for(const [key,child] of Object.entries(value))visit(file,child,`${field}.${key}`);
 }
 for(const file of files('src')){
  if(file.endsWith('.json'))visit(file,JSON.parse(readFileSync(file,'utf8')),'$');
  else if(/\.(njk|md|html)$/.test(file))visit(file,readFileSync(file,'utf8'),'text');
 }
 assert.ok(entries.every(entry=>entry.file.startsWith('src/')&&entry.field&&entry.context.includes('[TBC]')));
 const rows=entries.map(entry=>`| ${entry.file} | ${entry.field} | ${entry.occurrence} | ${entry.context} |`);
 const output='# Session 20: facts for NEO to confirm\n\nGenerated from authored source fields by test/tbc.test.js. Placeholders are allowed during the release review. Count: '+entries.length+'. Generated HTML repeats these source values; those repetitions are not separate facts. No missing fact is guessed.\n\n| File | Field | Occurrence | Context |\n| --- | --- | ---: | --- |\n'+rows.join('\n')+'\n';
 mkdirSync('docs/review/session-20',{recursive:true});writeFileSync('docs/review/session-20/TBC.md',output);
 console.log(`TBC inventory: ${entries.length} occurrences; docs/review/session-20/TBC.md`);
});
test('production HTML contains no public sample or draft markers',()=>{
 for(const file of files('_site').filter(file=>file.endsWith('.html')))assert.doesNotMatch(readFileSync(file,'utf8'),/\[(?:SAMPLE|DRAFT)\]/,file);
});
