// Local release evidence only: run against a built site, never during a build.
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {getPathPrefix} from '../lib/urls.js';
const base=process.env.TEST_URL||'http://127.0.0.1:8120';
const prefix=getPathPrefix();const output='docs/review/session-20';
const routes={home:'',opportunities:'opportunities/',action:'opportunities/cbhe/',calls:'calls/',events:'events/',faq:'resources/faq/',about:'about/',contact:'about/contact/',privacy:'privacy/',accessibility:'accessibility/',projects:'resources/projects/',statistics:'resources/statistics/'};
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const records=[];
try{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 for(const lang of ['ka','en'])for(const width of [360,1280])for(const [name,route] of Object.entries(routes)){
  await page.setViewportSize({width,height:900});
  const response=await page.goto(`${base}${prefix}${lang}/${route}`);assert.equal(response.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name} ${lang} ${width}`);
  const file=`${name}-${lang}-${width}.png`;
  await page.screenshot({path:`${output}/${file}`,fullPage:true});
  records.push({page:name,path:`/${lang}/${route}`,language:lang,width,file,height:await page.evaluate(()=>document.documentElement.scrollHeight),overflow:false});
 }
 await writeFile(`${output}/screenshots.json`,JSON.stringify({date:'2026-10-28',javaScriptEnabled:false,records},null,2)+'\n');
 console.log(`Captured ${records.length} release views with no horizontal page overflow.`);
}finally{await browser.close();}
