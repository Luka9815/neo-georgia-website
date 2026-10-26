import { setTimeout as delay } from 'node:timers/promises';

export const oldSite = 'https://erasmus.org.ge';

// One request at a time, including retries. Never fetch attachment binaries.
export function createClient(requests, intervalMs = 1500) {
  let nextRequest = 0;
  async function request(url) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await delay(Math.max(0, nextRequest - Date.now()));
      nextRequest = Date.now() + intervalMs;
      const entry = { url: String(url), attempt };
      requests.push(entry);
      try {
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            'User-Agent':
              'NEO-Georgia-migration-review/1.0 (public API; no media download)',
          },
          signal: AbortSignal.timeout(20000),
        });
        entry.status = response.status;
        if (
          [429, 500, 502, 503, 504].includes(response.status) &&
          attempt < 3
        ) {
          const header = response.headers.get('retry-after');
          const seconds = /^\d+$/.test(header || '')
            ? Number(header)
            : (Date.parse(header) - Date.now()) / 1000;
          // Do not retry earlier than the server asks, or wait unboundedly.
          if (Number.isFinite(seconds) && seconds > 30) {
            throw new Error(
              `HTTP ${response.status}; Retry-After exceeds 30s, rerun later`
            );
          }
          nextRequest = Math.max(
            nextRequest,
            Date.now() + (seconds > 0 ? seconds : attempt * 3) * 1000
          );
          await response.body?.cancel();
          continue;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        entry.received = Array.isArray(data) ? data.length : 'object';
        return { data, headers: response.headers };
      } catch (error) {
        entry.error = error.cause?.code
          ? `${error.message} (${error.cause.code})`
          : error.message;
        throw new Error(`${url}: ${entry.error}`, { cause: error });
      }
    }
  }
  async function collection(resource, params = {}) {
    const items = [];
    const ids = new Set();
    const result = { resource, params, items, complete: false };
    try {
      for (let page = 1; page <= 500; page++) {
        const url = new URL(`/wp-json/wp/v2/${resource}`, oldSite);
        for (const [key, value] of Object.entries({
          per_page: 100,
          ...params,
          page,
        })) {
          url.searchParams.set(key, value);
        }
        const { data, headers } = await request(url);
        if (!Array.isArray(data))
          throw new Error('Expected a WordPress JSON array');
        const pages = Number(headers.get('x-wp-totalpages'));
        const total = headers.get('x-wp-total');
        if (total != null) result.expectedTotal = Number(total);
        let added = 0;
        for (const item of data) {
          if (!Number.isInteger(item.id))
            throw new Error('A REST item has no numeric ID');
          if (!ids.has(item.id)) {
            ids.add(item.id);
            items.push(item);
            added++;
          }
        }
        if ((pages > 0 && page >= pages) || (!pages && data.length < 100)) {
          if (
            result.expectedTotal != null &&
            result.expectedTotal !== items.length
          ) {
            throw new Error(
              'REST total changed during pagination; collection is incomplete'
            );
          }
          result.complete = true;
          break;
        }
        if (!added)
          throw new Error('Pagination repeated a page without new IDs');
        if (page === 500)
          throw new Error('Stopped at the 500-page safety limit');
      }
    } catch (error) {
      result.error = error.message;
    }
    return result;
  }
  return { request, collection };
}
