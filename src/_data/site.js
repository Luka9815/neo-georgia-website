import { readFileSync } from 'node:fs';
import { getPathPrefix, siteUrl } from '../../lib/urls.js';

export default function () {
  const file = 'src/_data/settings.json';
  const settings = JSON.parse(
    readFileSync(new URL('./settings.json', import.meta.url))
  );
  if (
    !Number.isInteger(settings.currentCallYear) ||
    settings.currentCallYear < 2000 ||
    settings.currentCallYear > 2100
  ) {
    throw new Error(`${file}: currentCallYear must be an integer from 2000 to 2100`);
  }
  if (typeof settings.siteLaunched !== 'boolean') {
    throw new Error(`${file}: siteLaunched must be a boolean (maintained in code)`);
  }
  return {
    url: siteUrl(),
    pathPrefix: getPathPrefix(),
    currentCallYear: settings.currentCallYear,
    siteLaunched: settings.siteLaunched,
  };
}
