import test from 'node:test';
import assert from 'node:assert/strict';
import nunjucks from 'nunjucks';
import {load} from 'cheerio';
test('role cards link real addresses and keep placeholders as plain text',()=>{
 const env=new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'),{autoescape:true});
 env.addFilter('markdown',text=>text);
 for(const roleEmail of ['[TBC]','coordinator@example.org']){
  const html=env.renderString("{% from 'cards.njk' import cards %}{{ cards(items,'person',t,'en','h2') }}",{items:[{title:'Coordinator',role:'Coordinator',roleBased:true,name:'[TBC]',roleEmail,body:'Guidance'}],t:{nameLabel:'Name',roleEmail:'Role email'}});
  const $=load(html);assert.equal($('h2').text(),'Coordinator');
  assert.equal($('a').length,roleEmail==='[TBC]'?0:1);
  if(roleEmail!=='[TBC]')assert.equal($('a').attr('href'),`mailto:${roleEmail}`);
 }
});
