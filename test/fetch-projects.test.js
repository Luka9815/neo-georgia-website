import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { collectProjects, requestBody, callYears, sourceOrganisations, slimProject, snapshotDiff, main, ENDPOINT, ORIGIN } from '../scripts/fetch-projects.js';

globalThis.fetch = () => { throw new Error('Live network forbidden in refresh tests'); };
const source = () => JSON.parse(readFileSync('test/fixtures/projects-snapshot.json')).projects[0];
const rawProject = (index, year = 2022) => {
  const { coordinator, georgianOrganisations, organisationCount, organisationCountries, cardUrl, ...project } = source();
  return { ...project, projectName: `TEST-${year}-${index}`, projectCallYear: String(year), organisationDocuments: [coordinator, ...georgianOrganisations], description: 'PRIVATE DESCRIPTION', contacts: ['PRIVATE CONTACT'] };
};
const response = (total, projectDocuments) => ({ ok: true, json: async () => ({ total, projectDocuments }) });

// No test contacts the service. Omitting the injected fake fetch always throws.
test('refresh tests forbid live network and importing the script does not run the CLI', async () => {
  await assert.rejects(collectProjects({ years: [2022] }), /Live network forbidden/);
});

test('manual CLI refuses CI before any read or network operation', async () => {
  const previous = process.env.CI;
  try { process.env.CI = 'true'; await assert.rejects(main([]), /refuse to run in CI/); }
  finally { if (previous === undefined) delete process.env.CI; else process.env.CI = previous; }
});

test('request is exactly Luka’s verified body, with a string call year and numeric from/size', () => {
  assert.deepEqual(requestBody(2022, 100), {
    from: 100, index: 'eplus2021', keyword: '', matchAllCountries: false,
    project: { projectCallYear: '2022' }, coordinator: {}, partner: {},
    organisation: { organisationCountry: 'GE', organisationRole: 'coordinator_or_partner' },
    size: 100, sort: '', withAggregations: false,
  });
  assert.deepEqual(callYears(2028), Array.from({ length: 15 }, (_, i) => 2014 + i));
  assert.equal(callYears().at(-1), new Intl.DateTimeFormat('en', { timeZone: 'Asia/Tbilisi', year: 'numeric' }).format(new Date()) * 1);
  assert.throws(() => callYears(2013), /from 2014/);
});

test('projectDocuments pagination uses exact headers, from 0/100, 500 ms spacing and matching totals', async () => {
  const calls = [], pauses = [], pages = [];
  const { snapshot, totals } = await collectProjects({
    years: [2022], retrieved: '2026-10-28', pause: async ms => pauses.push(ms), onPage: async (year, from) => pages.push([year,from]),
    fetchImpl: async (url, options) => {
      assert.equal(url, ENDPOINT); assert.equal(options.method, 'POST');
      assert.deepEqual(options.headers, { 'Content-Type': 'application/json', Origin: ORIGIN });
      const body = JSON.parse(options.body); calls.push(body);
      return response(101, Array.from({ length: body.from === 0 ? 100 : 1 }, (_, i) => rawProject(body.from + i)));
    },
  });
  assert.deepEqual(calls.map(c => [c.project.projectCallYear,c.size,c.from]), [['2022',100,0],['2022',100,100]]);
  assert.deepEqual(pauses, [500]); assert.deepEqual(pages, [[2022,0],[2022,100]]);
  assert.deepEqual(totals, { 2022: 101 }); assert.equal(snapshot.meta.total, 101);
  assert.doesNotMatch(JSON.stringify(snapshot), /PRIVATE DESCRIPTION|PRIVATE CONTACT/);
  assert.deepEqual(Object.keys(snapshot.projects[0]).sort(), Object.keys(source()).filter(k => k !== 'description').sort());
});

test('short pages still advance from by 100 and fail if retrieved count differs from total', async () => {
  const offsets = [];
  await assert.rejects(collectProjects({ years: [2022], pause: async () => {}, fetchImpl: async (_, options) => {
    const from = JSON.parse(options.body).from; offsets.push(from);
    return response(101, [rawProject(from)]);
  } }), /retrieved 2 projects but total is 101/);
  assert.deepEqual(offsets, [0,100]);
});

test('an empty page ends pagination and fails the year if its total is not met', async () => {
  let calls = 0;
  await assert.rejects(collectProjects({ years: [2022], fetchImpl: async () => { calls++; return response(5, []); } }), /retrieved 0 projects but total is 5/);
  assert.equal(calls, 1);
  const empty = await collectProjects({ years: [2022], fetchImpl: async () => response(0, []) });
  assert.deepEqual(empty.totals, { 2022: 0 });
});

test('each year is independently checked and failed/duplicate/changing-total responses abort the run', async () => {
  await assert.rejects(collectProjects({ years: [2021,2022], pause: async () => {}, fetchImpl: async (_, options) => {
    const year = Number(JSON.parse(options.body).project.projectCallYear);
    return year === 2021 ? response(1, [rawProject(1,year)]) : response(2, [rawProject(1,year)]);
  } }), /2022: retrieved 1 projects but total is 2/);
  await assert.rejects(collectProjects({ years: [2022], fetchImpl: async () => ({ ok:false, status:503 }) }), /HTTP 503/);
  await assert.rejects(collectProjects({ years: [2022], fetchImpl: async () => response(2,[rawProject(1),rawProject(1)]) }), /duplicate project/);
  let page = 0;
  await assert.rejects(collectProjects({ years:[2022], pause:async()=>{}, fetchImpl:async()=> page++ === 0 ? response(101,Array.from({length:100},(_,i)=>rawProject(i))) : response(102,[rawProject(100)]) }), /total changed/);
});

test('unexpected response/organisation structures fail instead of guessing or publishing partial data', async () => {
  await assert.rejects(collectProjects({ years:[2022], fetchImpl:async()=>({ok:true,json:async()=>({total:1,items:[rawProject(1)]})}) }), /expected projectDocuments/);
  const raw = rawProject(1);
  assert.equal(sourceOrganisations(raw), raw.organisationDocuments);
  assert.throws(() => sourceOrganisations({projectName:'MISSING'}), /unambiguous full organisation array/);
  assert.throws(() => sourceOrganisations({...raw, another:raw.organisationDocuments}), /unambiguous full organisation array/);
});

test('slimming retains the audit schema and discards long/contact fields', () => {
  const p = rawProject(1); p.organisationDocuments[1].contact = 'PRIVATE CONTACT';
  const slim = slimProject(p, sourceOrganisations(p));
  assert.equal(slim.organisationCount, 2); assert.equal(slim.georgianOrganisations.length, 1);
  assert.doesNotMatch(JSON.stringify(slim), /PRIVATE DESCRIPTION|PRIVATE CONTACT/);
});

test('snapshot differences report added/removed/changed references and ignore property/array ordering', () => {
  const a=source(), b={...source(),projectName:'REMOVE'}, c={...source(),projectName:'ADD'};
  assert.deepEqual(snapshotDiff({projects:[a,b]},{projects:[c,{...a,projectTitle:'Changed title'}]}),{added:['ADD'],removed:['REMOVE'],changed:[a.projectName]});
  const reordered=Object.fromEntries(Object.entries(a).reverse());reordered.organisationCountries=[...reordered.organisationCountries].reverse();
  assert.deepEqual(snapshotDiff({projects:[a]},{projects:[reordered]}),{added:[],removed:[],changed:[]});
});
