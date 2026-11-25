// Computed styles and native interactions on either clean output layout.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { getPathPrefix } from '../lib/urls.js';
import { serveFixtureSite } from './fixture-site.js';

const prefix = getPathPrefix();
const server = await serveFixtureSite(process.env.REVIEW_ROOT || process.cwd(), prefix);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const report = { responsive: [], news: [], buttonContrasts: [], openCreditAxe: 0 };
const rgb = (value) => value.match(/[\d.]+/g).map(Number);
function luminance(channels) {
  return channels.slice(0, 3).reduce((sum, value, i) => {
    const channel = value / 255;
    const linear = channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    return sum + linear * [.2126, .7152, .0722][i];
  }, 0);
}
function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
}
const whitePixelUnder = (channels, opacity) => channels.map(channel => Math.round(channel * opacity + 255 * (1 - opacity)));
async function visit(page, lang, path = '') {
  const response = await page.goto(`${server.base}${prefix}${lang}/${path}`);
  if (response) assert.equal(response.status(), 200, page.url());
  await page.evaluate(() => document.fonts.ready);
}

async function buttonStyles(button) {
  await button.evaluate(async (element) => {
    await new Promise(requestAnimationFrame);
    await Promise.all(element.getAnimations().map(animation => animation.finished));
  });
  return button.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      colour: style.color, background: style.backgroundColor, border: style.borderColor,
      shadow: style.boxShadow, transform: style.transform, outline: style.outlineStyle,
      focus: element.matches(':focus-visible'),
    };
  });
}
function checkButtonContrast(style, label) {
  const ratio = contrast(rgb(style.colour), rgb(style.background));
  assert.ok(ratio >= 4.5, `${label}: ${ratio}`);
  report.buttonContrasts.push({ label, ratio: Number(ratio.toFixed(2)) });
}
async function checkPhotoContrast(page) {
  const overlays = await page.evaluate(() => {
    const sections = ['.home-hero', '.home-figures'];
    return sections.map((selector) => {
      const section = document.querySelector(selector);
      const picture = section.querySelector('picture');
      const bounds = picture.getBoundingClientRect();
      const gradient = getComputedStyle(picture, '::after').backgroundImage;
      const colours = [...gradient.matchAll(/rgba?\(([^)]+)\)(?: ([\d.]+)% )?/g)];
      const stops = colours.map((match, index) => {
        const channels = match[1].match(/[\d.]+/g).map(Number);
        // Chromium prints explicit stop positions only for the directional hero.
        const x = match[2] === undefined ? index / (colours.length - 1) : Number(match[2]) / 100;
        return { x, channels: channels.slice(0, 3), alpha: channels[3] ?? 1 };
      });
      const text = section.querySelectorAll(selector === '.home-hero'
        ? '.eyebrow, h1, .hero-intro'
        : '.wrapper :is(h2,h3,p,dt,dd,summary,a)');
      const runs = [...text].filter(el => el.getClientRects().length).map(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const right = Math.max(...[...range.getClientRects()].map(rect => rect.right));
        return { colour: getComputedStyle(element).color, right: (right - bounds.left) / bounds.width };
      });
      return { stops, runs, horizontal: gradient.startsWith('linear-gradient(90deg') };
    });
  });
  const minima = overlays.map(({ stops, runs, horizontal }) => {
    assert.ok(stops.length >= 2);
    const ink = stops[0].channels;
    // Gradients darken vertically in Figures. For the hero use the rightmost glyph edge.
    const opacity = (right) => {
      if (!horizontal) return Math.min(...stops.map(stop => stop.alpha));
      const index = stops.findIndex(stop => stop.x >= right);
      if (index <= 0) return index === 0 ? stops[0].alpha : stops.at(-1).alpha;
      const a = stops[index - 1], b = stops[index];
      return a.alpha + (b.alpha - a.alpha) * (right - a.x) / (b.x - a.x);
    };
    return Math.min(...runs.map(run => contrast(rgb(run.colour), whitePixelUnder(ink, opacity(run.right)))));
  });
  assert.ok(minima[0] >= 4.5 && minima[1] >= minima[0], JSON.stringify(minima));
  return minima.map(value => Number(value.toFixed(2)));
}

async function checkNews(page, lang, path) {
  const cards = page.locator('.cards-news > .card');
  const result = await cards.evaluateAll((items) => items.map(card => {
    const style = getComputedStyle(card);
    const title = getComputedStyle(card.querySelector('.card-primary'));
    const body = getComputedStyle(card.querySelector('.card-body p'));
    const media = card.querySelector('.news-media').getBoundingClientRect();
    const meta = getComputedStyle(card.querySelector('.card-meta'));
    return {
      height: card.getBoundingClientRect().height, top: card.getBoundingClientRect().top,
      align: style.alignSelf, titleClamp: title.webkitLineClamp, excerptClamp: body.webkitLineClamp,
      ratio: media.width / media.height, wrap: meta.flexWrap,
      placeholder: card.querySelector('.news-placeholder')?.getAttribute('aria-hidden'),
    };
  }));
  assert.ok(result.length > 1);
  assert.ok(result.some(card => card.placeholder === 'true'));
  assert.ok(result.every(card => card.titleClamp === '3' && card.excerptClamp === '3'
    && Math.abs(card.ratio - 16 / 9) < .01 && card.wrap === 'nowrap'));
  const grid = page.locator('.cards-news').first();
  assert.equal(await grid.evaluate(el => getComputedStyle(el).alignItems), 'start');
  if (page.viewportSize().width >= 1280) {
    // Compare real unequal cards in a row. Some language/row pairs legitimately tie.
    const unequal = result.some(a => result.some(b => a.top === b.top && Math.abs(a.height-b.height) > 1));
    report.news.push({ lang, width: page.viewportSize().width, path, unequal, heights: result.map(card => Number(card.height.toFixed(2))) });
  }
}

async function checkCredit(page, details) {
  const summary = details.locator('summary');
  await summary.click();
  const panel = details.locator('.photo-credit-panel');
  assert.ok(await panel.isVisible());
  const bounds = await panel.boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= page.viewportSize().width);
  assert.ok(await panel.locator('a:visible').count());
  const violations = (await new AxeBuilder({ page }).options({ resultTypes: ['violations'] }).analyze()).violations;
  assert.deepEqual(violations.map(({id,nodes}) => ({ id, nodes: nodes.map(node=>node.target) })), []);
  report.openCreditAxe++;
  await summary.click();
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  const outside = new Set();
  page.on('request', request => {
    if (!request.url().startsWith(server.base) && !request.url().startsWith('data:')) outside.add(request.url());
  });

  for (const lang of ['ka','en']) for (const width of [320,390,768,1280,1920]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(page, lang);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${lang}/ @ ${width}`);
    const palette = await page.locator('.home-band').evaluateAll(bands => bands.map(band => {
      const style = getComputedStyle(band);
      return style.backgroundImage === 'none' ? style.backgroundColor : style.backgroundImage;
    }));
    assert.ok(palette.every((background, index) => index === 0 || background !== palette[index - 1]));
    const [heroContrast, figuresContrast] = await checkPhotoContrast(page);
    await checkNews(page, lang, 'Home');
    for (const path of ['opportunities/', 'opportunities/cbhe/', 'calls/', 'events/', 'news/', 'news/neo-dissemination-event-2025/',
      'find/', 'find/student/', 'resources/statistics/', 'resources/projects/2022/', 'resources/faq/',
      'resources/publications/', 'about/contact/', 'search/', 'privacy/']) {
      await visit(page, lang, path);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${lang}/${path} @ ${width}`);
      if (path === 'news/') await checkNews(page, lang, path);
      if (path === 'opportunities/' && width >= 1280) {
        const titles = await page.locator('.cards-action h4').evaluateAll(items => items.map(title => ({
          text: title.textContent, height: title.clientHeight, scrollHeight: title.scrollHeight,
        })));
        assert.ok(titles.every(title => title.scrollHeight <= title.height + 1), JSON.stringify({lang,width,titles}));
      }
    }
    report.responsive.push({ lang, width, heroContrast, figuresContrast, templates: 16 });
  }
  assert.ok(report.news.some(row => row.unequal && row.path === 'Home'));
  assert.ok(report.news.some(row => row.unequal && row.path === 'news/'));

  for (const lang of ['ka','en']) for (const width of [390,1280]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(page, lang);
    for (const button of await page.locator('.home-hero .button').all()) {
      await page.mouse.move(0,0);
      const rest = await buttonStyles(button);
      await button.hover();
      const hover = await buttonStyles(button);
      assert.notEqual(hover.background, rest.background);
      assert.equal(hover.transform, 'matrix(1, 0, 0, 1, 0, -1)');
      assert.notEqual(hover.shadow, 'none');
      await page.mouse.move(0,0);
      await page.keyboard.press('Tab');
      await button.focus();
      const focus = await buttonStyles(button);
      assert.equal(focus.focus, true);
      assert.equal(focus.outline, 'solid');
      assert.equal(focus.background, hover.background);
      await button.evaluate(el => el.blur());
    }
    const audienceCard = page.locator('.audience-tiles .card').first();
    const tile = audienceCard.locator('.icon-slot');
    const tileColour = () => tile.evaluate(el => getComputedStyle(el).backgroundColor);
    const tileRest = await tileColour();
    await audienceCard.hover();
    await page.waitForFunction(colour => getComputedStyle(document.querySelector('.audience-tiles .icon-slot')).backgroundColor !== colour, tileRest);
    await page.mouse.move(0,0);
    await page.keyboard.press('Tab');
    await audienceCard.locator('.card-primary').focus();
    assert.equal(await audienceCard.evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    await checkCredit(page, page.locator('.photo-figures .photo-credit-control'));
    const statisticsLink = page.locator('.home-figures > .wrapper > p').last().locator('a');
    assert.ok((await statisticsLink.boundingBox()).height >= 44);

    await visit(page, lang, 'news/');
    await checkCredit(page, page.locator('.news-credit .photo-credit-control'));
    const news = page.locator('.cards-news .card-clickable').filter({ has: page.locator('.news-placeholder') }).first();
    const href = await news.locator('.card-primary').getAttribute('href');
    const media = news.locator('.news-placeholder');
    await media.scrollIntoViewIfNeeded();
    const box = await media.boundingBox();
    await page.mouse.click(box.x + 15, box.y + 15);
    await page.waitForURL(new URL(href, page.url()).href);
    assert.equal(new URL(page.url()).pathname, href);

    await visit(page, lang);
    const top = page.locator('.back-to-top');
    assert.equal(await top.isVisible(), false);
    await page.evaluate(() => scrollTo(0, innerHeight * 1.9));
    assert.equal(await top.isVisible(), false);
    await page.evaluate(() => scrollTo(0, innerHeight * 2.1));
    await top.waitFor({ state: 'visible' });
    const target = await top.boundingBox();
    const point = { x: target.x + target.width / 2, y: target.y + target.height / 2 };
    assert.ok(await page.evaluate(({x,y}) => Boolean(document.elementFromPoint(x,y)?.closest('.back-to-top')), point));
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(() => scrollY === 0);
    assert.equal(new URL(page.url()).hash, '#top');
    await top.waitFor({ state: 'hidden' });
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  await visit(page, 'ka');
  // Exercise all four variants as native buttons, including real :active/:disabled.
  await page.evaluate(() => {
    const tray = document.createElement('div');
    tray.id = 'button-check';
    tray.style = 'position:fixed;inset:1rem 1rem auto;z-index:99;display:flex;gap:1rem;padding:1rem;background:#fff';
    for (const surface of ['', ' button-on-dark']) {
      const pair = document.createElement('div');
      pair.style = `display:flex;gap:1rem;padding:1rem;background:${surface ? '#05264f' : '#fff'}`;
      for (const variant of ['', ' button-secondary']) {
        const control = document.createElement('button');
        control.className = 'button' + surface + variant;
        control.textContent = 'ღილაკი';
        pair.append(control);
      }
      tray.append(pair);
    }
    document.body.append(tray);
  });
  for (const button of await page.locator('#button-check .button').all()) {
    const name = await button.getAttribute('class');
    await page.mouse.move(0,0);
    checkButtonContrast(await buttonStyles(button), `${name} rest`);
    await button.hover();
    const hover = await buttonStyles(button);
    checkButtonContrast(hover, `${name} hover`);
    await page.mouse.down();
    const pressed = await buttonStyles(button);
    assert.equal(pressed.transform, 'none');
    checkButtonContrast(pressed, `${name} active`);
    await page.mouse.up();
    await page.mouse.move(0,0);
    await page.keyboard.press('Tab');
    await button.focus();
    const focus = await buttonStyles(button);
    assert.equal(focus.outline, 'solid');
    checkButtonContrast(focus, `${name} focus`);
    await button.evaluate(el => { el.disabled = true; });
    await button.hover();
    const disabled = await buttonStyles(button);
    assert.equal(disabled.transform, 'none');
    checkButtonContrast(disabled, `${name} disabled`);
  }
  await page.locator('#button-check').evaluate(el => el.remove());

  for (const lang of ['ka','en']) for (const width of [390,1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'none' });
    await visit(page, lang);
    const button = page.locator('.home-hero .button-secondary');
    const before = await buttonStyles(button);
    await button.hover();
    const after = await buttonStyles(button);
    assert.notEqual(after.background, before.background);
    assert.equal(after.transform, 'none');
    await page.emulateMedia({ forcedColors: 'active' });
    const decoration = page.locator('.band-decoration,.section-rule,.sector-marker,.news-placeholder,.card-arrow,.home-figures .figures .icon,.sector-heading .icon-slot,.compact-update .icon-slot,.back-to-top .icon');
    const visibleDecoration = await decoration.evaluateAll(items => items.filter(el =>
      el.getAttribute('aria-hidden') !== 'true' || getComputedStyle(el).display !== 'none').map(el => el.getAttribute('class')));
    assert.deepEqual(visibleDecoration, []);
    assert.equal(await page.locator('.photo-figures picture').isVisible(), false);
    assert.equal(await page.locator('.photo-figures img').getAttribute('aria-hidden'), 'true');
    await page.locator('.photo-figures summary').click();
    assert.ok(await page.locator('.photo-figures .photo-credit-panel').isVisible());
  }
  assert.deepEqual([...outside], []);
  await context.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 390, height: 900 } });
  const native = await noJs.newPage();
  for (const lang of ['ka','en']) {
    await visit(native, lang);
    await native.evaluate(() => scrollTo(0, innerHeight * 2.1));
    const top = native.locator('.back-to-top');
    assert.equal(await top.getAttribute('href'), '#top');
    assert.ok(await top.isVisible());
    await top.focus();
    await native.keyboard.press('Enter');
    assert.equal(new URL(native.url()).hash, '#top');
    assert.equal(await native.evaluate(() => scrollY), 0);
  }
  await noJs.close();
  const directory = 'docs/review/session-28';
  await mkdir(directory,{recursive:true});
  await writeFile(`${directory}/browser-${prefix==='/'?'root':'prefix'}.json`, JSON.stringify(report,null,2) + '\n');
  console.log(`Session 28: ${report.responsive.length} language/width combinations, ${report.openCreditAxe} open-credit axe scans and ${report.buttonContrasts.length} AA button state checks passed.`);
} finally {
  await browser.close();
  await server.close();
}
