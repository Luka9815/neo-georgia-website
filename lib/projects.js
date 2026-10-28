import { readFileSync, statSync } from 'node:fs';
import { Temporal } from '@js-temporal/polyfill';

export const PROJECT_SOURCE = new URL('../migration/source/erasmus-projects-georgia-2026-10-28.json', import.meta.url);
export const PROJECT_SOURCE_URL = 'https://erasmus-plus.ec.europa.eu/projects';
export const SOURCE_STATUSES = { finalized: 'completed', ongoing: 'ongoing', terminated: 'terminated', unknown: 'unknown' };
const periods = { PROGRAMME_2014_2020: '2014–2020', PROGRAMME_2021_2027: '2021–2027' };

export function titleLanguage(title) {
  const latin = (title.match(/\p{Script=Latin}/gu) || []).length;
  for (const [script, lang] of [['Georgian', 'ka'], ['Cyrillic', 'und-Cyrl'], ['Armenian', 'hy'], ['Greek', 'el'], ['Arabic', 'ar']]) {
    if ((title.match(new RegExp(`\\p{Script=${script}}`, 'gu')) || []).length > latin) return lang;
  }
  return 'en';
}

export function validateProjectSnapshot(snapshot, file = 'projects snapshot') {
  const fail = (path, reason) => { throw new Error(`${file}: ${path}: ${reason}`); };
  const text = (value, path) => {
    if (typeof value !== 'string' || !value.trim()) fail(path, 'required non-empty text');
    return value;
  };
  const date = (value, path) => {
    text(value, path);
    try {
      // The service encodes calendar dates as midnight in Europe/Brussels.
      return Temporal.Instant.from(value.replace(/([+-]\d{2})(\d{2})$/, '$1:$2'))
        .toZonedDateTimeISO('Europe/Brussels').toPlainDate().toString();
    } catch { fail(path, 'invalid source date'); }
  };
  const organisation = (value, path, georgian = false) => {
    if (!value || typeof value !== 'object') fail(path, 'required organisation');
    const name = text(value.organisationName, `${path}.organisationName`);
    const country = text(value.organisationCountry, `${path}.organisationCountry`);
    if (!/^[A-Z]{2}$/.test(country)) fail(`${path}.organisationCountry`, 'expected a two-letter source country code');
    if (!georgian) return { name, country };
    if (country !== 'GE') fail(`${path}.organisationCountry`, 'Georgian participation must have country GE');
    const id = text(value.organisationPIC, `${path}.organisationPIC`);
    const role = value.organisationRole;
    if (!['coordinator', 'partner', 'country-mobility'].includes(role)) fail(`${path}.organisationRole`, 'unknown role');
    if (value.organisationCity != null && typeof value.organisationCity !== 'string') fail(`${path}.organisationCity`, 'expected text (empty is allowed)');
    return { id, name, country, city: value.organisationCity ?? '', role };
  };
  if (!snapshot?.meta || !Array.isArray(snapshot.projects)) fail('$', 'expected meta and projects');
  const snapshotDate = text(snapshot.meta.retrieved, 'meta.retrieved');
  try { Temporal.PlainDate.from(snapshotDate); } catch { fail('meta.retrieved', 'invalid snapshot day'); }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate)) fail('meta.retrieved', 'expected YYYY-MM-DD');
  if (snapshot.meta.total !== snapshot.projects.length) fail('meta.total', 'does not match project count');
  const references = new Set();
  const projects = snapshot.projects.map((item, index) => {
    const path = `projects[${index}]`;
    const reference = text(item.projectName, `${path}.projectName`);
    if (!/^[A-Za-z0-9-]+$/.test(reference)) fail(`${path}.projectName`, 'invalid project reference');
    if (references.has(reference)) fail(`${path}.projectName`, `duplicate reference ${reference}`);
    references.add(reference);
    const title = text(item.projectTitle, `${path}.projectTitle`);
    const year = Number(item.projectCallYear);
    if (!/^\d{4}$/.test(String(item.projectCallYear)) || year < 2014 || year > 2100) fail(`${path}.projectCallYear`, 'invalid call year');
    const period = periods[item.projectProgrammeYears];
    if (!period) fail(`${path}.projectProgrammeYears`, 'unknown programme period');
    if (!Object.hasOwn(SOURCE_STATUSES, item.projectStatus)) fail(`${path}.projectStatus`, 'unknown source status');
    const start = date(item.projectStartDate, `${path}.projectStartDate`);
    const end = date(item.projectEndDate, `${path}.projectEndDate`);
    if (end < start) fail(`${path}.projectEndDate`, 'end precedes start');
    const coordinator = organisation(item.coordinator, `${path}.coordinator`);
    if (!Array.isArray(item.georgianOrganisations) || !item.georgianOrganisations.length) fail(`${path}.georgianOrganisations`, 'at least one GE organisation or mobility-country entry is required');
    const organisations = item.georgianOrganisations.map((org, i) => organisation(org, `${path}.georgianOrganisations[${i}]`, true));
    if (new Set(organisations.map(org => org.id)).size !== organisations.length) fail(`${path}.georgianOrganisations`, 'duplicate project/organisation pair');
    if (!Number.isInteger(item.organisationCount) || item.organisationCount < organisations.length) fail(`${path}.organisationCount`, 'invalid total organisation count');
    const officialUrl = `https://erasmus-plus.ec.europa.eu/projects/search/details/${reference}`;
    if (item.cardUrl !== officialUrl) fail(`${path}.cardUrl`, 'must be the official card for this reference');
    return {
      reference, title, titleLang: titleLanguage(title), year, period,
      actionLabel: text(item.projectLevel3Label, `${path}.projectLevel3Label`),
      keyActionLabel: text(item.projectLevel2Label, `${path}.projectLevel2Label`),
      start, end, status: SOURCE_STATUSES[item.projectStatus], coordinator, organisations,
      organisationCount: item.organisationCount, officialUrl,
    };
  });
  // Only this allowlist reaches templates. Never spread raw project/organisation fields.
  return { snapshotDate, sourceUrl: PROJECT_SOURCE_URL, projects };
}

let cached;
let signature;
export function loadProjectSnapshot() {
  const stat = statSync(PROJECT_SOURCE);
  const next = `${stat.mtimeMs}:${stat.size}`;
  if (next !== signature) {
    let raw;
    try { raw = JSON.parse(readFileSync(PROJECT_SOURCE, 'utf8')); }
    catch (cause) { throw new Error(`${PROJECT_SOURCE.pathname}: invalid JSON`, { cause }); }
    cached = validateProjectSnapshot(raw, PROJECT_SOURCE.pathname);
    signature = next;
  }
  return cached;
}

export function mapProjectActions(data, mapping) {
  const actions = ['icm', 'erasmus-mundus', 'cbhe', 'jean-monnet', 'cb-vet', 'cb-youth', 'youth-mobility', 'virtual-exchanges', 'cb-sport'];
  const sectors = ['higher-education', 'youth', 'vet', 'school', 'adult', 'sport', 'other'];
  return {
    ...data,
    projects: data.projects.map(project => {
      const value = mapping[project.actionLabel];
      if (!value || !sectors.includes(value.sector) || (value.action !== null && !actions.includes(value.action))) {
        throw new Error(`src/_data/projectActionMap.json: ${project.actionLabel}: missing or invalid reviewed mapping`);
      }
      return { ...project, ...value, group: value.action ? `action-${value.action}` : `sector-${value.sector}` };
    }),
  };
}

export function loadMappedProjects() {
  return mapProjectActions(loadProjectSnapshot(), JSON.parse(readFileSync(new URL('../src/_data/projectActionMap.json', import.meta.url), 'utf8')));
}
