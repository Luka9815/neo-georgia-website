// Local evidence only. Never called by a build, test or deployment.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const phase = process.env.REVIEW_PHASE || 'after';
const base = process.env.TEST_URL || 'http://127.0.0.1:8141';
const out = `docs/review/session-23/${phase}`;
const routes = {home:'', about:'about/', student:'find/student/', university:'find/university/', youth:'find/youth/', vet:'find/vet/', sport:'find/sport/', opportunities:'opportunities/', credits:'about/credits/', news:'news/'};
await mkdir(out, {recursive:true});
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
const records = [];
try {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  for (const lang of ['ka','en']) for (const width of [390,1280]) for (const [name,route] of Object.entries(routes)) {
    await page.setViewportSize({width,height:900});
    const response = await page.goto(`${base}/${lang}/${route}`);
    const absent = false;
    assert.equal(response.status(), absent ? 404 : 200);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { for (const img of document.images) { img.loading='eager'; await img.decode().catch(()=>{}); } });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const file = `${name}-${lang}-${width}.png`;
    await page.screenshot({path:`${out}/${file}`,fullPage:true});
    records.push({name,lang,width,file,absent,status:response.status()});
  }
  await writeFile(`${out}/screenshots.json`,JSON.stringify(records,null,2)+'\n');
} finally { await browser.close(); }
console.log(`${phase}: ${records.length} screenshots`);
