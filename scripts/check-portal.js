import assert from 'node:assert/strict';
export async function checkPortal(browser,base,prefix) {
 const routes=['','find/','about/','about/credits/','opportunities/cbhe/','resources/statistics/','find/student/','calls/','news/','resources/faq/'];
 for(const forcedColors of ['none','active']) {
  const context=await browser.newContext({javaScriptEnabled:false,forcedColors,reducedMotion:'reduce',viewport:{width:320,height:800}});
  try {
   const page=await context.newPage();
   for(const lang of ['ka','en']) {
    for(const route of routes){
     await page.goto(`${base}${prefix}${lang}/${route}`);
     await page.evaluate(()=>document.fonts.ready);
     assert.equal(await page.locator('h1').count(),1);
     assert.ok(await page.locator('h1').isVisible());
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${lang}/${route}, forced colours ${forcedColors}`);
     if(route==='' && forcedColors==='none') {
      const photo=page.locator('.photo-hero .portal-image');
      await photo.evaluate(el=>el.decode());
      assert.ok(await photo.evaluate(el=>el.naturalWidth>=320 && el.getBoundingClientRect().height>200));
      const credit=page.locator('.photo-hero figcaption a');
      await credit.scrollIntoViewIfNeeded();
      assert.ok(await credit.evaluate(el=>{
       const r=el.getClientRects()[0];
       return document.elementFromPoint(r.x+4,r.y+r.height/2)?.closest('a')===el;
      }),'Hero credit must receive pointer input above the image/text layers');
     }
     if(route==='' || route==='find/') {
      const tiles=page.locator('.audience-tiles .card');
      assert.equal(await tiles.count(),5);
      const rows=await tiles.evaluateAll(els=>els.map(el=>({height:el.getBoundingClientRect().height,links:el.querySelectorAll('a').length})));
      assert.ok(rows.every(r=>r.links===1 && r.height>=64 && r.height<=80),JSON.stringify(rows));
      assert.ok(await page.locator('.audience-tiles').evaluate(el=>el.getBoundingClientRect().height)<430);
      const link=tiles.first().locator('a');await link.focus();
      assert.ok(await tiles.first().evaluate(el=>getComputedStyle(el).outlineStyle!=='none'));
      assert.equal(await link.evaluate(el=>getComputedStyle(el).textDecorationLine),'underline');
      const href=await link.getAttribute('href');await Promise.all([page.waitForURL(url=>url.pathname===href),page.keyboard.press('Enter')]);
      assert.equal(new URL(page.url()).pathname,href);
      await page.goto(`${base}${prefix}${lang}/${route}`);
     }
     if(route==='resources/faq/') {
      const summary=page.locator('.faq-item summary').first();await summary.focus();await page.keyboard.press('Enter');
      assert.equal(await page.locator('.faq-item').first().getAttribute('open'),'');
      assert.ok(await page.locator('.faq-answer').first().isVisible());
      await page.keyboard.press('Space');assert.equal(await page.locator('.faq-item').first().getAttribute('open'),null);
     }
     if(route==='resources/statistics/') {
      const scroll=page.locator('.chart-scroll').first();await page.bringToFront();await scroll.scrollIntoViewIfNeeded();await scroll.focus();
      const start=await scroll.evaluate(el=>({left:el.scrollLeft,max:el.scrollWidth-el.clientWidth}));
      await page.keyboard.press(start.left<start.max?'ArrowRight':'ArrowLeft');
      let moved=false;
      for(let attempt=0;attempt<60;attempt++) {
       if(await scroll.evaluate((el,left)=>el.scrollLeft!==left,start.left)){moved=true;break;}
       if(attempt&&attempt%10===0)await page.keyboard.press(start.left<start.max?'ArrowRight':'ArrowLeft');
       await new Promise(resolve=>setTimeout(resolve,50));
      }
      assert.ok(moved,`Chart keyboard scrolling: ${lang}, forced colours ${forcedColors}, initial ${JSON.stringify(start)}`);
      const bubble=page.locator('.participant-map a').first();await bubble.focus();
      assert.ok(await bubble.evaluate(el=>el===document.activeElement));
      const hash=await bubble.getAttribute('href');await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash,hash);
      assert.ok(await page.locator(hash).isVisible());
     }
    }
    await page.goto(`${base}${prefix}${lang}/find/`);
    assert.equal(await page.locator('.audience-tiles a').count(),5);
    const href=await page.locator('.audience-tiles a').first().getAttribute('href');
    await page.locator('.audience-tiles a').first().click();assert.equal(new URL(page.url()).pathname,href);
    assert.equal(await page.locator('[data-find-action]').count(),3);
   }
  } finally {await context.close();}
 }
 console.log('Portal: 320px, no-JS finder, FAQ keyboard, chart scrolling and map links passed in normal/forced colours, both languages.');
}
