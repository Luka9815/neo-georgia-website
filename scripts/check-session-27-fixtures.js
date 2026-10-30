// Retry the complete existing fixture checks separately from the 109-page queue.
import {chromium} from 'playwright';
import {serveFixtureSite} from './fixture-site.js';
import {getPathPrefix} from '../lib/urls.js';
import {checkEditableSurfaces} from './check-editable-surfaces.js';
import {checkCalendar} from './check-calendar.js';
import {checkProjects} from './check-projects.js';
import {checkSearch} from './check-search.js';
import {checkContentFixtures} from './check-content-fixtures.js';
import {checkPortal} from './check-portal.js';
const prefix=getPathPrefix(),server=await serveFixtureSite(process.cwd(),prefix);
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try {
 await checkEditableSurfaces(browser,server.base,prefix);
 await checkCalendar(browser,server.base,prefix);
 await checkProjects(browser,server.base,prefix);
 await checkSearch(browser,server.base,prefix);
 await checkContentFixtures(browser,prefix);
 await checkPortal(browser,server.base,prefix);
 console.log('All existing fixture checks passed separately; complete coverage and default timeouts retained.');
}finally{await browser.close();await server.close();}
