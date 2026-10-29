import office from '../src/_data/office.json' with {type:'json'};
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { loadContent } from '../lib/content.js';
import { validateSupporting } from '../lib/validate-supporting.js';
import { romanise } from '../scripts/wp/convert.js';
import { getPathPrefix } from '../lib/urls.js';
const prefix = getPathPrefix();
const read = path => readFileSync(path, 'utf8');
const data = loadContent();
const routes = ['resources/publications/', 'resources/faq/', 'about/team/', 'about/here/', 'about/contact/'];
test('new sitemap pages render both languages, exact switches and EU footer', () => {
  for (const lang of ['ka', 'en']) for (const route of routes) {
    const $ = load(read(`_site/${lang}/${route}index.html`));
    const other = lang === 'ka' ? 'en' : 'ka';
    assert.equal($('html').attr('lang'), lang);
    assert.equal($('h1').length, 1);
    assert.equal($('header a[hreflang]').attr('href'), `${prefix}${other}/${route}`);
    assert.equal($('.eu-footer .eu-emblem').length, 1);
    assert.ok($('.eu-footer .funding-disclaimer').text().length > 100);
    assert.equal($('iframe, form[action], img[src^="https:"]').length, 0);
  }
});
test('Publications are complete without JavaScript and filter metadata matches records', () => {
  for (const lang of ['ka', 'en']) {
    const $ = load(read(`_site/${lang}/resources/publications/index.html`));
    assert.equal($('[data-publication-filters][hidden]').length, 1);
    assert.equal($('[data-publications] > li:not([hidden])').length, data.publication.length);
    for (const item of data.publication) {
      const row = $(`[data-publications] > li[data-year="${item.year}"][data-type="${item.type}"]`);
      assert.equal(row.find('a').attr('href'), item.url || prefix + item.file.slice(1));
      assert.ok(row.text().includes(item.publisher));
      assert.match(item.sourceChecked, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(row.text().includes(item[lang].title));
    }
    assert.equal($('#publication-year option').length, new Set(data.publication.map(p=>p.year)).size+1);
  }
});
test('FAQ groups and related Action pages use the same records', () => {

  for (const lang of ['ka', 'en']) for (const item of data.faq) {
    const faq = load(read(`_site/${lang}/resources/faq/index.html`));
    assert.ok(faq('main').text().includes(item[lang].title));
    const accordion=faq('.faq-item').filter((_,el)=>faq(el).find('summary').text().includes(item[lang].title));
    assert.equal(accordion.length,1);assert.ok(accordion.find('.faq-answer').text().trim());
    assert.match(item.sourceChecked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(faq(`a[href="${item.sourceUrl}"]`).length);
    assert.doesNotMatch(item[lang].title+item[lang].body, /\[SAMPLE\]/);
    for (const action of data.action) {
      const page = load(read(`_site/${lang}/opportunities/${action.slug}/index.html`));
      assert.equal(page('main').text().includes(item[lang].title), item.actions.includes(action.slug));
    }
  }
});
test('people have national transliteration, separate groups and no contact details or images', () => {
  for (const person of data.person) {
    // Placeholders carry no name; real names must follow the national system.
    if (!person.roleBased && !person.ka.title.startsWith('[SAMPLE]'))
      assert.equal(person.en.title.toLowerCase(), romanise(person.ka.title));
    assert.ok(!person.photo && !person.email && !person.phone);
    if (person.roleBased) assert.ok(office.team[person.officeKey]);
    for (const lang of ['ka', 'en']) for (const [group, route] of [['neo', 'about/team'], ['here', 'about/here']]) {
      const $ = load(read(`_site/${lang}/${route}/index.html`));
      assert.equal($('main').text().includes(person[lang].title), person.group === group);
      assert.equal($('main img').length, 0);
    }
  }
});
test('Contact uses final labelled fields with no form, map or third-party asset', () => {
  for (const lang of ['ka', 'en']) {
    const $ = load(read(`_site/${lang}/about/contact/index.html`));
    assert.equal($('main dd').length, 4);
    const strings = JSON.parse(read(`src/_data/${lang}.json`));
    assert.deepEqual($('main dd').map((_, el) => $(el).text()).get(), [office.contact.address[lang], office.contact.phone, office.contact.hours[lang], office.contact.email]);
    assert.equal($('footer h3').length, office.socialLinks.length?1:0);
    assert.equal($('main form, iframe, main script').length, 0);
    for (const el of $('[src]')) assert.ok($(el).attr('src').startsWith(prefix));
    const about = load(read(`_site/${lang}/about/index.html`));
    for (const route of ['about/team/', 'about/here/', 'about/contact/']) assert.equal(about(`main a[href="${prefix}${lang}/${route}"]`).length, 1);
  }
});
test('supporting content rejects missing translation, invalid references and unsafe files', () => {
  const actions = new Set(data.action.map(item => item.slug));
  for (const [type, field, value] of [['publication','file','https://example.org/x.pdf'], ['publication','year',2013], ['publication','type','other'], ['faq','actions',['missing']], ['faq','topic','unknown'], ['person','group','other'], ['person','en',null]]) {
    const item = structuredClone(data[type][0]);
    item[field] = value;
    assert.throws(() => validateSupporting(item, type, `src/content/${type}/${item.slug}.json`, actions), new RegExp(field === 'en' ? 'en.title' : field));
  }
});

test('Team uses explicit integer order, one role heading and labelled names',()=>{
 for(const lang of ['ka','en']){
  const $=load(read(`_site/${lang}/about/team/index.html`));
  const people=[...data.person].sort((a,b)=>a.order-b.order);
  assert.deepEqual($('.cards-person h2').map((_,el)=>$(el).text()).get(),people.map(p=>p[lang].title));
  for(const [index,person] of people.entries()){
   const card=$('.cards-person > li').eq(index);const role=office.team[person.officeKey];
   assert.equal(card.find('p').first().text(),`${JSON.parse(read(`src/_data/${lang}.json`)).nameLabel}: ${role.name[lang]}`);
   assert.equal(card.find('p').filter((_,el)=>$(el).text()===person[lang].role).length,0);
   assert.equal(card.find('a[href^="mailto:"]').length,role.roleEmail==='[TBC]'?0:1);
  }
 }
 const person=data.person[0];
 for(const order of [undefined,'1',1.5,null])assert.throws(()=>validateSupporting({...person,order},'person',`src/content/person/${person.slug}.json`,new Set()),/order/);
});
