import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import projectData from '../src/_data/projectData.js';
import {organisationRanking,projectChart} from '../lib/project-charts.js';
const data=projectData();
test('bilingual SVG charts reproduce every statistics table value and retain the coverage warning directly below',()=>{
 for(const lang of ['ka','en']){
  const $=load(readFileSync(`_site/${lang}/resources/statistics/index.html`,'utf8'));
  for(const kind of ['years','groups','statuses']){
   const svg=$(`#${lang}-${kind}-title`).closest('svg');
   assert.ok(svg.find('desc').text());
   assert.deepEqual(svg.find('[data-chart-value]').map((_,el)=>Number($(el).attr('data-chart-value'))).get(),data.stats[kind].map(row=>row.count));
   assert.equal(svg.attr('role'),'img');
   if(kind==='years')assert.equal(svg.parent().next('[data-project-mobility-coverage]').length,1);
  }
  const ranking=organisationRanking(data.projects);
  assert.deepEqual($('[data-organisation-ranking] tbody th').map((_,el)=>$(el).text()).get(),ranking.map(row=>row.label));
  assert.deepEqual($('[data-organisation-ranking] tbody td').map((_,el)=>Number($(el).text())).get(),ranking.map(row=>row.count));
 }
});
test('organisation ranking counts unique projects by source ID and excludes the synthetic mobility entry',()=>{
 const org={id:'a',name:'Original <name>',role:'partner'};
 const projects=[{reference:'p1',organisations:[org,org,{id:'synthetic',name:'Mobilities - Georgia',role:'country-mobility'}]},{reference:'p2',organisations:[org]}];
 assert.deepEqual(organisationRanking(projects),[{id:'a',label:'Original <name>',count:2}]);
 const svg=projectChart(organisationRanking(projects),'Title','Table below','safe');
 assert.ok(svg.includes('Original &lt;name&gt;'));assert.ok(!svg.includes('<name>'));
 assert.throws(()=>projectChart([{label:'x',count:-1}],'t','d','id'),/non-negative/);
});
