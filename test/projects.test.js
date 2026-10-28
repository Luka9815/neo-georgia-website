import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadProjectSnapshot, validateProjectSnapshot } from '../lib/projects.js';

globalThis.fetch = () => { throw new Error('Network access forbidden in project tests'); };
const fixture = () => JSON.parse(readFileSync('test/fixtures/projects-snapshot.json', 'utf8'));

test('public project projection drops all excluded source fields and restores Brussels calendar dates', () => {
  const data = validateProjectSnapshot(fixture(), 'fixture.json');
  const project = data.projects[0];
  assert.equal(project.start, '2015-01-01');
  assert.equal(project.end, '2017-06-30');
  assert.equal(project.titleLang, 'en');
  assert.equal(project.status, 'completed');
  assert.deepEqual(Object.keys(project.coordinator).sort(), ['country', 'name']);
  assert.doesNotMatch(JSON.stringify(data), /987654321|DO NOT PUBLISH|beneficiary\.example|organisation\.example|projectGrantedEuAmount|projectWebsite/);
});

for (const [name, mutate, field] of [
  ['missing title', d => delete d.projects[0].projectTitle, 'projectTitle'],
  ['duplicate reference', d => { d.projects.push(structuredClone(d.projects[0])); d.meta.total++; }, 'duplicate reference'],
  ['no Georgian organisation', d => d.projects[0].georgianOrganisations = [], 'georgianOrganisations'],
  ['wrong country', d => d.projects[0].georgianOrganisations[0].organisationCountry = 'US', 'country GE'],
  ['unknown status', d => d.projects[0].projectStatus = 'invented', 'unknown source status'],
  ['bad calendar date', d => d.projects[0].projectStartDate = '2026-02-30T00:00:00Z', 'invalid source date'],
  ['unsafe card', d => d.projects[0].cardUrl = 'https://example.org/', 'official card'],
  ['bad count', d => d.meta.total = 99, 'meta.total'],
]) test(`snapshot rejects ${name} with file/field evidence`, () => {
  const data = fixture(); mutate(data);
  assert.throws(() => validateProjectSnapshot(data, 'fixture.json'), error => error.message.includes('fixture.json:') && error.message.includes(field));
});

test('supplied snapshot reproduces official source facts and distinguishes mobility-country entries', () => {
  const raw = JSON.parse(readFileSync('migration/source/erasmus-projects-georgia-2026-10-28.json'));
  const data = loadProjectSnapshot();
  assert.equal(new Set(raw.projects.map(p => p.projectName)).size, 6764);
  const count = field => Object.fromEntries([...new Set(raw.projects.map(p => p[field]))].sort().map(value => [value, raw.projects.filter(p => p[field] === value).length]));
  assert.deepEqual(count('projectStatus'), { finalized: 4584, ongoing: 2128, terminated: 52 });
  assert.deepEqual(count('projectCallYear'), { 2014:463, 2015:435, 2016:429, 2017:460, 2018:476, 2019:417, 2020:454, 2021:294, 2022:769, 2023:731, 2024:660, 2025:741, 2026:435 });
  assert.equal(data.projects.filter(p => p.coordinator.country === 'GE').length, 106);
  const pairs = data.projects.flatMap(p => p.organisations.map(o => ({ project: p.reference, ...o })));
  assert.equal(new Set(pairs.map(o => o.id)).size, 606);
  assert.equal(new Set(pairs.map(o => `${o.project}/${o.id}`)).size, 7124);
  const named = pairs.filter(o => o.role !== 'country-mobility');
  assert.equal(new Set(named.map(o => o.id)).size, 605);
  assert.equal(named.length, 5079);
  assert.equal(pairs.filter(o => o.role === 'country-mobility').length, 2045);
});
