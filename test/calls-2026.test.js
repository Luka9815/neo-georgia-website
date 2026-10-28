import test from 'node:test';
import assert from 'node:assert/strict';
import { loadContent, callStatus, zonedDateTime } from '../lib/content.js';
const expected={icm:'02-19T12:00','erasmus-mundus-joint-masters':'02-12T17:00','erasmus-mundus-design-measures':'02-12T17:00',cbhe:'02-10T17:00','jean-monnet':'02-03T17:00','cb-vet':'03-26T17:00','cb-youth':'02-26T17:00','youth-mobility-february':'02-12T12:00','youth-mobility-october':'10-01T12:00','virtual-exchanges':'03-26T17:00','cb-sport':'03-05T17:00'};
test('eleven verified institutional calls cover all nine Actions with Brussels deadlines and no invented opening times',()=>{
 const content=loadContent();assert.equal(content.call.length,11);
 assert.deepEqual([...new Set(content.call.map(x=>x.action))].sort(),content.action.map(x=>x.slug).sort());
 for(const item of content.call){
  assert.equal(item.deadline,'2026-'+expected[item.slug.replace(/-2026$/,'')]);
  assert.equal(item.timeZone,'Europe/Brussels');assert.equal(item.year,2026);assert.equal(item.opens,undefined);
  assert.equal(item.sourceChecked,'2026-10-28');assert.ok(item.url.startsWith('https://erasmus-plus.ec.europa.eu/programme-guide/part-b/'));
  assert.equal(callStatus(item,new Date('2026-10-28T10:00Z')),'closed');
  for(const lang of ['ka','en'])assert.doesNotMatch(item[lang].title+item[lang].body,/\[SAMPLE\]/);
 }
 assert.ok(zonedDateTime(content.call.find(x=>x.slug==='youth-mobility-october-2026').deadline,'Europe/Brussels').endsWith('+02:00'));
 const item=content.call[0];const deadline=new Date(zonedDateTime(item.deadline,item.timeZone));
 assert.equal(callStatus(item,deadline),'open');assert.equal(callStatus(item,new Date(deadline.getTime()+1)),'closed');
});
