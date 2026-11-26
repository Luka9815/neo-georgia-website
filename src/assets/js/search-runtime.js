import { searchWithFallback } from './georgian-search.js';

export function createSearch(index, language) {
  let loading;
  function load() {
    loading ??= import(index).then(async engine => {
      // Indexed URLs already include PATH_PREFIX.
      await engine.options({ baseUrl: '/' });
      return engine;
    }).catch(error => {
      loading = undefined;
      throw error;
    });
    return loading;
  }

  async function search(query, limit = Infinity) {
    const engine = await load();
    const found = await searchWithFallback(engine, query, language);
    const items = await Promise.all(found.slice(0, limit).map(result => result.data()));
    return [...new Map(items.map(item => [item.url, item])).values()];
  }

  return { load, search };
}
