import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { collectProjects, requestBody, slimProject, snapshotDiff, validateRequest, main, ENDPOINT } from '../scripts/fetch-projects.js';

globalThis.fetch = () => { throw new Error('Live network forbidden in refresh tests'); };
const config = () => JSON.parse(readFileSync('test/fixtures/project-search-request.json'));
const source = () => JSON.parse(readFileSync('test/fixtures/projects-snapshot.json')).projects[0];
const rawProject = index => {
  const p = source();
  return { ...p, projectName: `TEST-2022-${index}`, organisations: [p.coordinator, ...p.georgianOrganisations], description: 'PRIVATE DESCRIPTION', contacts: ['PRIVATE CONTACT'] };
};

test('refresh refuses unconfirmed/missing captured protocol before any network call', async () => {
  assert.throws(() => validateRequest({}), /confirmed captured request/);
  const c = config(); delete c.origin;
  assert.throws(() => validateRequest(c), /Origin/);
  const unsafe = config(); unsafe.itemsPath = ['__proto__'];
  assert.throws(() => validateRequest(unsafe), /safe JSON property path/);
  await assert.rejects(collectProjects(config()), /Synthetic request fixtures cannot make live requests/);
});

test('manual CLI refuses CI and never runs on import', async () => {
  const previous = process.env.CI;
  try { process.env.CI = 'true'; await assert.rejects(main([]), /refuse to run in CI/); }
  finally { if (previous === undefined) delete process.env.CI; else process.env.CI = previous; }
});

test('captured body substitution preserves numeric/string parameters without inventing fields', () => {
  assert.deepEqual(requestBody({ y: '{{year}}', text: '{{yearText}}', query: 'year={{year}}', pagination: ['{{size}}','{{offset}}','{{page}}'] }, 2022, 100, 1), { y: 2022, text: '2022', query: 'year=2022', pagination: [100,100,2] });
});

test('synthetic pagination uses POST size 100, captured Origin, a 500 ms delay and exact totals', async () => {
  const calls = [], pauses = [], pages = [];
  const { snapshot, totals } = await collectProjects(config(), {
    years: [2022], retrieved: '2026-10-28', pause: async ms => pauses.push(ms), onPage: async (year, offset) => pages.push([year,offset]),
    fetchImpl: async (url, options) => {
      assert.equal(url, ENDPOINT); assert.equal(options.method, 'POST');
      assert.equal(options.headers.Origin, config().origin);
      const body = JSON.parse(options.body); calls.push(body);
      const items = Array.from({ length: body.offset === 0 ? 100 : 1 }, (_, i) => rawProject(body.offset + i));
      return { ok: true, json: async () => ({ total: 101, items }) };
    },
  });
  assert.deepEqual(calls.map(c => [c.year,c.size,c.offset]), [[2022,100,0],[2022,100,100]]);
  assert.deepEqual(pauses, [500]); assert.deepEqual(pages, [[2022,0],[2022,100]]);
  assert.deepEqual(totals, { 2022: 101 }); assert.equal(snapshot.meta.total, 101);
  assert.doesNotMatch(JSON.stringify(snapshot), /PRIVATE DESCRIPTION|PRIVATE CONTACT/);
  assert.deepEqual(Object.keys(snapshot.projects[0]).sort(), Object.keys(source()).filter(k => k !== 'description').sort());
});

test('refresh rejects failed, short, duplicate and changing-total responses instead of claiming completion', async () => {
  for (const [response, message] of [
    [{ ok: false, status: 503 }, /HTTP 503/],
    [{ ok: true, json: async () => ({ total: 101, items: [rawProject(1)] }) }, /short or oversized/],
    [{ ok: true, json: async () => ({ total: 2, items: [rawProject(1),rawProject(1)] }) }, /duplicate project/],
  ]) await assert.rejects(collectProjects(config(), { years: [2022], fetchImpl: async () => response, pause: async () => {} }), message);
  let page = 0;
  await assert.rejects(collectProjects(config(), { years: [2022], pause: async () => {}, fetchImpl: async () => ({ ok: true, json: async () => page++ === 0 ? { total: 101, items: Array.from({ length: 100 }, (_, i) => rawProject(i)) } : { total: 102, items: [rawProject(100)] } }) }), /total changed/);
});

test('slimming preserves the supplied audit schema while dropping raw long/contact fields', () => {
  const p = rawProject(1); p.organisations[1].contact = 'PRIVATE CONTACT';
  const slim = slimProject(p, p.organisations);
  assert.equal(slim.organisationCount, 2);
  assert.equal(slim.georgianOrganisations.length, 1);
  assert.doesNotMatch(JSON.stringify(slim), /PRIVATE DESCRIPTION|PRIVATE CONTACT/);
});

test('snapshot differences report added/removed/changed references and ignore property/array ordering', () => {
  const a = source(), b = { ...source(), projectName: 'REMOVE' }, c = { ...source(), projectName: 'ADD' };
  const changed = { ...a, projectTitle: 'Changed title' };
  assert.deepEqual(snapshotDiff({ projects: [a,b] }, { projects: [c,changed] }), { added: ['ADD'], removed: ['REMOVE'], changed: [a.projectName] });
  const reordered = Object.fromEntries(Object.entries(a).reverse());
  reordered.organisationCountries = [...reordered.organisationCountries].reverse();
  assert.deepEqual(snapshotDiff({ projects: [a] }, { projects: [reordered] }), { added: [], removed: [], changed: [] });
});
