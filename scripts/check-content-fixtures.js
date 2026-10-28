import {rmSync} from 'node:fs';
import {createFixtureSite,buildFixtureSite,serveFixtureSite} from './fixture-site.js';
import {checkCalendar} from './check-calendar.js';
export async function checkContentFixtures(browser,prefix) {
 const root=createFixtureSite();let server;
 try {
  buildFixtureSite(root,prefix);server=await serveFixtureSite(root,prefix);
  await checkCalendar(browser,server.base,prefix);
  console.log('Fixture calendar: non-empty bilingual keyboard navigation and per-Event downloads passed.');
 }finally{if(server)await server.close();rmSync(root,{recursive:true,force:true});}
}
