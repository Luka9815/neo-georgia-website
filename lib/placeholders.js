import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
export const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(dir,entry.name)):[join(dir,entry.name)]).sort();
export function placeholders(root='src', markers=/\[(?:TBC|SAMPLE|DRAFT|ALT NEEDED)\]/g){
 const entries=[];
 function visit(file,value,path,language='shared'){
  if(typeof value==='string'){for(const match of value.matchAll(markers))entries.push({file,path,language,marker:match[0]});}
  else if(value&&typeof value==='object')for(const [key,child] of Object.entries(value))visit(file,child,`${path}.${key}`,['ka','en'].includes(key)?key:language);
 }
 for(const file of files(root)){
  if(file.endsWith('.json'))visit(file,JSON.parse(readFileSync(file,'utf8')),'$');
  else if(/\.(njk|md|html)$/.test(file))visit(file,readFileSync(file,'utf8'),'text',file.match(/\/(ka|en)\//)?.[1]||'shared');
 }
 return entries;
}
export function assertNoPlaceholders(root){const entries=placeholders(root);if(entries.length)throw new Error('Launch blocked by unresolved markers:\n'+entries.map(e=>`${e.file}: ${e.path}: ${e.language}: ${e.marker}`).join('\n'));}
