import * as pagefind from 'pagefind';
import { readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import getViews from '../src/_data/views.js';
import { getPathPrefix } from '../lib/urls.js';
export async function buildSearch(output = '_site', prefix = getPathPrefix()) {
  rmSync(join(output, 'pagefind'), { recursive: true, force: true });
  try {
    for (const lang of ['ka', 'en']) {
      const { index, errors } = await pagefind.createIndex({ forceLanguage: lang, rootSelector: 'main', excludeSelectors: ['.notice'] });
      if (errors.length || !index) throw new Error(errors.join('\n') || 'Missing Pagefind index');
      const views = getViews().filter(view => view.lang === lang && !['redirect', 'legacyRedirect', '404', 'search'].includes(view.kind));
      for (const view of views) {
        const result = await index.addHTMLFile({ url: prefix + view.path.slice(1), content: readFileSync(join(output, view.path.slice(1), 'index.html'), 'utf8') });
        if (result.errors.length) throw new Error(result.errors.join('\n'));
      }
      const result = await index.writeFiles({ outputPath: resolve(output, 'pagefind', lang) });
      if (result.errors.length) throw new Error(result.errors.join('\n'));
      await index.deleteIndex();
      console.log(`Pagefind ${lang}: ${views.length} pages`);
    }
  } finally { await pagefind.close(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await buildSearch();
