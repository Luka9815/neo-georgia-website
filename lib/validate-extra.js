import {basename} from 'node:path';
import {Temporal} from '@js-temporal/polyfill';
export const resourceTypes=['presentation','recording','guide','template','website'];
export function validateExtra(item,type,file,actions,events){
 const fail=(field,msg)=>{throw new Error(`${file}: ${field}: ${msg}`);};
 const text=(v,path)=>{if(typeof v!=='string'||!v.trim())fail(path,'required non-empty text');};
 const url=(v,path)=>{try{if(new URL(v).protocol!=='https:')throw Error();}catch{fail(path,'use a complete HTTPS URL');}};
 if(!item||typeof item!=='object'||Array.isArray(item))fail('$','expected an object');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)||basename(file,'.json')!==item.slug)fail('slug','must match the ASCII filename');
 if(type==='story'&&item.en&&typeof item.en==='object'&&!Object.values(item.en).some(v=>String(v??'').trim()))delete item.en;
 const langs=type==='story'?['ka',...(item.en?['en']:[])]:['ka','en'];
 for(const lang of langs)for(const field of (type==='action'?['title']:['title','body']))text(item[lang]?.[field],`${lang}.${field}`);
 if(['story','resource'].includes(type)){
  if(!Number.isInteger(item.year)||item.year<2000||item.year>2100)fail('year','use an integer year from 2000 to 2100');
  const refs=type==='story'?[item.action]:item.actions;
  if(!Array.isArray(refs))fail('actions','expected action slugs');for(const slug of refs)if(!actions.has(slug))fail(type==='story'?'action':'actions',`unknown Action: ${slug}`);
 }
 if(type==='resource'){
  if(!['official','neo','partner'].includes(item.source))fail('source','use official, neo or partner');
  if(!resourceTypes.includes(item.type))fail('type','unknown resource type');
  if(!['ka','en','ka/en'].includes(item.language))fail('language','use ka, en or ka/en');
  url(item.url,'url');if(item.event&&!events.has(item.event))fail('event','use an existing Event slug');
 }
 if(type==='action'){
  if(!['KA1','KA2','KA3','Jean Monnet'].includes(item.keyAction))fail('keyAction','unknown Key Action');
  for(const key of ['sectors','audience'])if(!Array.isArray(item[key])||!item[key].length)fail(key,'required list');
  for(const lang of langs)for(const key of ['summary','who','how'])text(item[lang]?.[key],`${lang}.${key}`);
  if(!Array.isArray(item.officialLinks)||!item.officialLinks.length)fail('officialLinks','required source links');for(const [i,link] of item.officialLinks.entries())url(link.url,`officialLinks[${i}].url`);
 }
}
export function validateSourceDate(item,type,file){
 if(['call','faq','resource','publication'].includes(type)&&!item.sourceChecked)throw new Error(`${file}: sourceChecked: required YYYY-MM-DD verification date`);
 for(const key of ['sourceChecked','updated'])if(item[key]!=null){try{if(!/^\d{4}-\d{2}-\d{2}$/.test(item[key]))throw Error();Temporal.PlainDate.from(item[key],{overflow:'reject'});}catch{throw new Error(`${file}: ${key}: use a valid YYYY-MM-DD date`);}}
 for(const key of ['url','sourceUrl'])if(item[key]){try{if(new URL(item[key]).protocol!=='https:')throw Error();}catch{throw new Error(`${file}: ${key}: use a complete HTTPS URL`);}}
}
