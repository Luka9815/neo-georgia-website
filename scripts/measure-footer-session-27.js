// Measure the actual selected PNG bitmap, including whole-image resize rounding.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {serveFixtureSite} from './fixture-site.js';
const server=await serveFixtureSite(process.cwd());
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const rows=[];
try {
 const page=await browser.newPage();
 for(const width of [320,390,600,768,1280,1920])for(const lang of ['ka','en']) {
  await page.setViewportSize({width,height:900});await page.goto(`${server.base}/${lang}/`);await page.evaluate(()=>document.fonts.ready);
  const brand=await page.locator('.brand').boundingBox();const emblem=page.locator('.eu-emblem');await emblem.scrollIntoViewIfNeeded();await emblem.evaluate(e=>e.decode());
  const result=await emblem.evaluate(async e=>{
   const image=await createImageBitmap(e),canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
   const context=canvas.getContext('2d');context.drawImage(image,0,0);const pixels=context.getImageData(0,0,image.width,image.height).data;const ys=[];
   for(let y=0;y<image.height;y++)for(let x=0;x<image.width/4;x++){const i=(y*image.width+x)*4;if(pixels[i]<80&&pixels[i+1]<140&&pixels[i+2]>120){ys.push(y);break;}}
   const r=e.getBoundingClientRect(),top=Math.min(...ys),bottom=Math.max(...ys);
   return {imageWidth:r.width,imageHeight:r.height,bitmapWidth:image.width,bitmapHeight:image.height,flagTop:top,flagBottom:bottom,flagHeight:(bottom-top+1)*r.height/image.height,source:new URL(e.currentSrc).pathname};
  });
  assert.ok(result.flagHeight>=38);assert.ok(brand.width<=result.imageWidth&&brand.height<=result.imageHeight,`${lang}/${width} emblem prominence`);rows.push({width,lang,...result});
 }
 await writeFile('docs/review/session-27/footer-rendered-geometry.json',JSON.stringify(rows,null,2)+'\n');console.log('Selected-bitmap flag size and full wordmark prominence pass at six widths in both languages.');
}finally{await browser.close();await server.close();}
