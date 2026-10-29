import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const phase=process.env.REVIEW_PHASE||'after';
const base=process.env.TEST_URL||'http://127.0.0.1:8141';
const out=`docs/review/session-24/${phase}`;await mkdir(out,{recursive:true});
const routes={contact:'about/contact/',team:'about/team/',hereOld:'here/',hereNew:'about/here/',privacy:'privacy/',accessibility:'accessibility/',credits:'about/credits/',calls:'calls/',home:'',about:'about/',opportunities:'opportunities/',student:'find/student/',university:'find/university/',youth:'find/youth/',vet:'find/vet/',sport:'find/sport/'};
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const rows=[];
try{const page=await browser.newPage();for(const lang of ['ka','en'])for(const width of [390,1280])for(const [name,path]of Object.entries(routes)){
 await page.setViewportSize({width,height:900});const response=await page.goto(`${base}/${lang}/${path}`);if(name==='hereOld'&&phase!=='before')await page.waitForURL('**/about/here/');await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{});}});
 const file=`${name}-${lang}-${width}.png`;await page.screenshot({path:`${out}/${file}`,fullPage:true});rows.push({lang,width,path,status:response.status(),finalUrl:page.url(),file});
}await writeFile(`${out}/screenshots.json`,JSON.stringify(rows,null,2)+'\n');}finally{await browser.close();}console.log(`${phase}: ${rows.length} captures`);
