import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { Temporal } from '@js-temporal/polyfill';
import { validateProjectSnapshot, PROJECT_SOURCE } from '../lib/projects.js';

export const ENDPOINT = 'https://ec.europa.eu/programmes/service/search/project/search';
const projectFields = ['projectName', 'projectCallYear', 'projectProgrammeYears', 'projectLevel2Label', 'projectLevel3Label', 'projectField', 'projectTitle', 'projectStatus', 'projectStartDate', 'projectEndDate', 'projectGrantedEuAmount', 'projectCoverage', 'projectGoodPractice', 'projectSuccessStory', 'projectWebsite', 'projectTopicsList', 'projectTotalPublishedResults', 'projectModifiedDate'];
const orgFields = ['organisationName', 'organisationPIC', 'organisationRole', 'organisationCountry', 'organisationCity', 'organisationType', 'organisationWebsite'];
const pick = (object, fields) => Object.fromEntries(fields.map(key => [key, object[key] ?? null]));
const snapshotDay = () => Temporal.Now.plainDateISO('Asia/Tbilisi').toString();

export const ORIGIN = 'https://erasmus-plus.ec.europa.eu';

export function callYears(currentYear = Temporal.Now.plainDateISO('Asia/Tbilisi').year) {
  if (!Number.isInteger(currentYear) || currentYear < 2014) throw new Error('Current call year must be an integer from 2014 onwards.');
  return Array.from({ length: currentYear - 2014 + 1 }, (_, index) => 2014 + index);
}

// Exact request supplied and verified by Luka on 2026-10-28.
export function requestBody(year, from) {
  return {
    from, index: 'eplus2021', keyword: '', matchAllCountries: false,
    project: { projectCallYear: String(year) }, coordinator: {}, partner: {},
    organisation: { organisationCountry: 'GE', organisationRole: 'coordinator_or_partner' },
    size: 100, sort: '', withAggregations: false,
  };
}

export function sourceOrganisations(project) {
  // Identify by the organisation record schema, not an invented response property name.
  const arrays = Object.values(project).filter(value => Array.isArray(value) && value.length && value.every(org =>
    org && typeof org === 'object' && ['organisationName', 'organisationCountry', 'organisationRole'].every(key => Object.hasOwn(org, key))
  ));
  if (arrays.length !== 1) throw new Error(`${project.projectName}: expected one unambiguous full organisation array`);
  return arrays[0];
}

export function slimProject(project, organisations) {
  if (!project || typeof project !== 'object' || !Array.isArray(organisations)) throw new Error('Response must contain a project and full organisation array.');
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

export async function collectProjects({ fetchImpl = globalThis.fetch, pause = ms => new Promise(done => setTimeout(done, ms)), onPage = async () => {}, years = callYears(), retrieved = snapshotDay() } = {}) {
  const projects = [];
  const totals = {};
  const seen = new Set();
  let requests = 0;
  for (const year of years) {
    let offset = 0;
    let total;
    let retrievedCount = 0;
    do {
      if (requests++) await pause(500);
      const response = await fetchImpl(ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
        body: JSON.stringify(requestBody(year, offset)),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`${year} offset ${offset}: HTTP ${response.status}; snapshot is incomplete`);
      const raw = await response.json();
      await onPage(year, offset, raw);
      const items = raw.projectDocuments;
      const reportedTotal = raw.total;
      if (!Array.isArray(items) || !Number.isInteger(reportedTotal) || reportedTotal < 0) throw new Error(`${year}: expected projectDocuments array and integer total; snapshot is incomplete`);
      if (total !== undefined && total !== reportedTotal) throw new Error(`${year}: total changed during pagination; retry the incomplete snapshot`);
      total = reportedTotal;
      if (items.length > 100) throw new Error(`${year}: oversized page; snapshot is incomplete`);
      if (!items.length) break;
      for (const project of items) {
        const slim = slimProject(project, sourceOrganisations(project));
        if (String(slim.projectCallYear) !== String(year)) throw new Error(`${slim.projectName}: response call year does not match request`);
        if (seen.has(slim.projectName)) throw new Error(`${slim.projectName}: duplicate project across pages/years`);
        seen.add(slim.projectName); projects.push(slim);
      }
      retrievedCount += items.length;
      offset += 100;
    } while (offset < total);
    if (retrievedCount !== total) throw new Error(`${year}: retrieved ${retrievedCount} projects but total is ${total}; snapshot is incomplete`);
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
  if (args.length) throw new Error('Usage: node scripts/fetch-projects.js (no request template is needed).');
  const previous = JSON.parse(await readFile(PROJECT_SOURCE, 'utf8'));
  const retrieved = snapshotDay();
  const output = resolve(`migration/source/erasmus-projects-georgia-${retrieved}`);
  try { await access(output); throw new Error(`Refuse to overwrite existing raw run: ${output}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(output, { recursive: true });
  try {
    const result = await collectProjects({ retrieved, onPage: (year, offset, raw) => writeFile(join(output, `${year}-${offset}.json`), JSON.stringify(raw)) });
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
