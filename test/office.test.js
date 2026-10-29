import test from 'node:test';
import assert from 'node:assert/strict';
import {loadOffice,validateOffice} from '../lib/office.js';
import {reportTbc} from '../scripts/report-tbc.js';
import {placeholders} from '../lib/placeholders.js';
test('office facts validate and the generated inventory reflects every authored placeholder',()=>{
 loadOffice();assert.deepEqual(reportTbc(),placeholders('src',/\[TBC\]/g));
});
for(const [path,value] of [['contact.email','bad'],['contact.phone','phone'],['team.coordinator.name.en','Wrong'],['contact.address.ka',''],['legal.registeredAddress.en',null],['socialLinks',[{ka:'ბმული',en:'Link',url:'http://example.org'}]]])test(`office errors name file and ${path}`,()=>{
 const office=structuredClone(loadOffice());if(path==='team.coordinator.name.en')office.team.coordinator.name.ka='ანა';
 const parts=path.split('.');const last=parts.pop();let parent=office;for(const key of parts)parent=parent[key];parent[last]=value;
 assert.throws(()=>validateOffice(office),error=>error.message.includes('src/_data/office.json: '+(path==='socialLinks'?'socialLinks[0].url':path)));
});
