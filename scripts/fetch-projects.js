import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { Temporal } from '@js-temporal/polyfill';
import { validateProjectSnapshot, PROJECT_SOURCE } from '../lib/projects.js';

export const ENDPOINT = 'https://ec.europa.eu/programmes/service/search/project/search';
const projectFields = ['projectName', 'projectCallYear', 'projectProgrammeYears', 'projectLevel2Label', 'projectLevel3Label', 'projectField', 'projectTitle', 'projectStatus', 'projectStartDate', 'projectEndDate', 'projectGrantedEuAmount', 'projectCoverage', 'projectGoodPractice', 'projectSuccessStory', 'projectWebsite', 'projectTopicsList', 'projectTotalPublishedResults', 'projectModifiedDate'];
const orgFields = ['organisationName', 'organisationPIC', 'organisationRole', 'organisationCountry', 'organisationCity', 'organisationType', 'organisationWebsite'];
const pick = (object, fields) => Object.fromEntries(fields.map(key => [key, object[key] ?? null]));
const at = (object, path) => path.reduce((value, key) => value && Object.hasOwn(value, key) ? value[key] : undefined, object);
const snapshotDay = () => Temporal.Now.plainDateISO('Asia/Tbilisi').toString();

export function validateRequest(config) {
  if (config?.confirmed !== true || typeof config.evidence !== 'string' || !config.evidence.trim()) {
    throw new Error('A confirmed captured request with evidence is required; do not guess the platform protocol.');
  }
  try { if (new URL(config.origin).origin !== config.origin || !config.origin.startsWith('https://')) throw new Error(); }
  catch { throw new Error('The captured HTTPS Origin header is required.'); }
  if (!config.body || typeof config.body !== 'object' || Array.isArray(config.body)) throw new Error('The exact captured POST body template is required.');
  for (const key of ['itemsPath', 'totalPath', 'projectPath', 'organisationsPath']) {
    if (!Array.isArray(config[key]) || config[key].some(part => typeof part !== 'string' || ['__proto__', 'constructor', 'prototype'].includes(part))) {
      throw new Error(`${key} must be an explicit safe JSON property path from the captured response.`);
    }
  }
  const template = JSON.stringify(config.body);
  if (config.scope?.index !== 'eplus2021' || config.scope?.organisationCountry !== 'GE' || config.scope?.organisationRole !== 'coordinator_or_partner') throw new Error('Confirm the captured eplus2021 / GE / coordinator_or_partner scope.');
  for (const value of ['{{size}}']) {
    if (!template.includes(value)) throw new Error(`Captured request template must retain ${value}`);
  }
  if (!template.includes('{{year}}') && !template.includes('{{yearText}}')) throw new Error('Captured call-year template is required.');
  if (!template.includes('{{offset}}') && !template.includes('{{page}}')) throw new Error('Captured pagination template is required.');
  if (template.includes('{{page}}') && ![0, 1].includes(config.pageBase)) throw new Error('Specify captured pageBase (0 or 1).');
  return config;
}

export function requestBody(template, year, offset, pageBase = 0) {
  if (Array.isArray(template)) return template.map(value => requestBody(value, year, offset, pageBase));
  if (template && typeof template === 'object') return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, requestBody(value, year, offset, pageBase)]));
  const values = { '{{year}}': year, '{{yearText}}': String(year), '{{size}}': 100, '{{offset}}': offset, '{{page}}': offset / 100 + pageBase };
  if (Object.hasOwn(values, template)) return values[template];
  return typeof template === 'string' ? template.replace(/\{\{(?:year|yearText|size|offset|page)\}\}/g, key => String(values[key])) : template;
}

export function slimProject(project, organisations) {
  if (!project || typeof project !== 'object' || !Array.isArray(organisations)) throw new Error('Captured response paths do not identify a project and organisation array.');
  const coordinators = organisations.filter(org => org.organisationRole === 'coordinator');
  if (coordinators.length !== 1) throw new Error(`${project.projectName}: expected exactly one coordinator`);
  return {
    ...pick(project, projectFields),
    cardUrl: `https://erasmus-plus.ec.europa.eu/projects/search/details/${project.projectName}`,
    organisationCount: organisations.length,
    organisationCountries: [...new Set(organisations.map(org => org.organisationCountry))].sort(),
    coordinator: pick(coordinators[0], orgFields),
    georgianOrganisations: organisations.filter(org => org.organisationCountry === 'GE').map(org => pick(org, orgFields)),
  };
}

export async function collectProjects(config, { fetchImpl = globalThis.fetch, pause = ms => new Promise(done => setTimeout(done, ms)), onPage = async () => {}, years = Array.from({ length: 13 }, (_, index) => 2014 + index), retrieved = snapshotDay() } = {}) {
  validateRequest(config);
  if (config.synthetic && fetchImpl === globalThis.fetch) throw new Error('Synthetic request fixtures cannot make live requests.');
  const projects = [];
  const totals = {};
  const seen = new Set();
  let requests = 0;
  for (const year of years) {
    let offset = 0;
    let total;
    do {
      if (requests++) await pause(500);
      const response = await fetchImpl(ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Origin: config.origin },
        body: JSON.stringify(requestBody(config.body, year, offset, config.pageBase)),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`${year} offset ${offset}: HTTP ${response.status}; snapshot is incomplete`);
      const raw = await response.json();
      await onPage(year, offset, raw);
      const items = at(raw, config.itemsPath);
      const reportedTotal = at(raw, config.totalPath);
      if (!Array.isArray(items) || !Number.isInteger(reportedTotal) || reportedTotal < 0) throw new Error(`${year}: captured response paths/total do not match; snapshot is incomplete`);
      if (total !== undefined && total !== reportedTotal) throw new Error(`${year}: total changed during pagination; retry the incomplete snapshot`);
      total = reportedTotal;
      if (items.length > 100 || (items.length < 100 && offset + items.length < total)) throw new Error(`${year}: short or oversized page before the reported total; snapshot is incomplete`);
      for (const item of items) {
        const project = at(item, config.projectPath);
        const slim = slimProject(project, at(project, config.organisationsPath));
        if (String(slim.projectCallYear) !== String(year)) throw new Error(`${slim.projectName}: response call year does not match request`);
        if (seen.has(slim.projectName)) throw new Error(`${slim.projectName}: duplicate project across pages/years`);
        seen.add(slim.projectName); projects.push(slim);
      }
      offset += items.length;
      if (!items.length && offset < total) throw new Error(`${year}: empty page before total; snapshot is incomplete`);
      if (offset > total) throw new Error(`${year}: received more projects than the reported total`);
    } while (offset < total);
    totals[year] = total;
  }
  const snapshot = { meta: {
    source: `Erasmus+ Project Results Platform search service, ${ENDPOINT} (the service behind https://erasmus-plus.ec.europa.eu/projects)`,
    retrieved,
    query: { index: 'eplus2021', organisationCountry: 'GE', organisationRole: 'coordinator_or_partner', projectCallYear: `${years[0]} to ${years.at(-1)}, one request series per year` },
    total: projects.length,
    note: 'Slimmed snapshot: long description/result fields dropped. Raw per-year responses kept locally, not committed. Content is as submitted by beneficiaries; see the platform disclaimer and terms of use. Organisations reduced to the coordinator, all Georgian organisations, a total organisation count and the list of organisation countries.',
  }, projects: projects.sort((a, b) => a.projectName.localeCompare(b.projectName)) };
  validateProjectSnapshot(snapshot, 'refreshed snapshot');
  return { snapshot, totals };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
}
export function snapshotDiff(previous, next) {
  const before = new Map(previous.projects.map(project => [project.projectName, project]));
  const after = new Map(next.projects.map(project => [project.projectName, project]));
  return {
    added: [...after.keys()].filter(key => !before.has(key)).sort(),
    removed: [...before.keys()].filter(key => !after.has(key)).sort(),
    changed: [...after.keys()].filter(key => before.has(key) && JSON.stringify(canonical(before.get(key))) !== JSON.stringify(canonical(after.get(key)))).sort(),
  };
}

export async function main(args = process.argv.slice(2)) {
  if (process.env.CI) throw new Error('Manual refresh only: refuse to run in CI.');
  if (resolve('.') !== fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '')) throw new Error('Run the manual refresh from the repository root so raw files remain git-ignored.');
  const requestIndex = args.indexOf('--request');
  if (requestIndex < 0 || !args[requestIndex + 1]) throw new Error('Supply --request <captured-request.json>. The supplied README omits the exact POST body, Origin and response paths; no request is guessed or sent.');
  const config = validateRequest(JSON.parse(await readFile(resolve(args[requestIndex + 1]), 'utf8')));
  if (config.synthetic) throw new Error('Synthetic request fixtures cannot be used for a live refresh.');
  const previous = JSON.parse(await readFile(PROJECT_SOURCE, 'utf8'));
  const retrieved = snapshotDay();
  const output = resolve(`migration/source/erasmus-projects-georgia-${retrieved}`);
  try { await access(output); throw new Error(`Refuse to overwrite existing raw run: ${output}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(output, { recursive: true });
  try {
    const result = await collectProjects(config, { retrieved, onPage: (year, offset, raw) => writeFile(join(output, `${year}-${offset}.json`), JSON.stringify(raw)) });
    const diff = snapshotDiff(previous, result.snapshot);
    const report = { complete: true, totals: result.totals, total: result.snapshot.projects.length, diff };
    await writeFile(join(output, 'snapshot.json'), JSON.stringify(result.snapshot, null, 2) + '\n');
    await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ ...report, candidate: join(output, 'snapshot.json') }, null, 2));
  } catch (error) {
    await writeFile(join(output, 'report.json'), JSON.stringify({ complete: false, error: error.message }, null, 2) + '\n');
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
