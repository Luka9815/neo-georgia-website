import {readFileSync} from 'node:fs';
import {romanise} from './romanise.js';
export function validateOffice(office, file='src/_data/office.json') {
 const fail=(path,message)=>{throw new Error(`${file}: ${path}: ${message}`);};
 const text=(value,path)=>{if(typeof value!=='string'||!value.trim())fail(path,'required non-empty text');};
 const bilingual=(value,path)=>{for(const lang of ['ka','en'])text(value?.[lang],`${path}.${lang}`);};
 const email=(value,path,optional=false)=>{if(optional&&!value)return;text(value,path);if(value!=='[TBC]'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))fail(path,'use an email address or [TBC]');};
 const names=(value,path)=>{bilingual(value,path);if(value.ka!=='[TBC]'&&value.en!=='[TBC]'&&value.en.toLowerCase()!==romanise(value.ka))fail(path+'.en','use the Georgian national transliteration of name.ka');};
 bilingual(office?.contact?.address,'contact.address');bilingual(office?.contact?.hours,'contact.hours');
 email(office?.contact?.email,'contact.email');
 text(office?.contact?.phone,'contact.phone');if(office.contact.phone!=='[TBC]'&&!/^\+?[0-9][0-9 ()-]{5,24}$/.test(office.contact.phone))fail('contact.phone','use a phone number or [TBC]');
 text(office?.legal?.eridaIdentificationCode,'legal.eridaIdentificationCode');bilingual(office?.legal?.registeredAddress,'legal.registeredAddress');
 for(const key of ['privacyContact','accessibilityContact']){text(office?.[key],key);if(office[key].includes('@'))email(office[key],key);}
 for(const key of ['coordinator','programmeOfficer','communicationsOfficer']){names(office?.team?.[key]?.name,`team.${key}.name`);email(office?.team?.[key]?.roleEmail,`team.${key}.roleEmail`);}
 bilingual(office?.here?.period,'here.period');
 if(!Array.isArray(office?.here?.members))fail('here.members','expected a list');
 office.here.members.forEach((member,i)=>{names(member?.name,`here.members[${i}].name`);bilingual(member?.institution,`here.members[${i}].institution`);email(member?.email,`here.members[${i}].email`,true);});
 if(!Array.isArray(office?.socialLinks))fail('socialLinks','expected a list');
 office.socialLinks.forEach((link,i)=>{bilingual(link,`socialLinks[${i}]`);try{if(new URL(link.url).protocol!=='https:')throw Error();}catch{fail(`socialLinks[${i}].url`,'use a complete HTTPS URL');}});
 return office;
}
export function loadOffice(file='src/_data/office.json'){let office;try{office=JSON.parse(readFileSync(file,'utf8'));}catch(error){throw new Error(`${file}: $: ${error.message}`);}return validateOffice(office,file);}
