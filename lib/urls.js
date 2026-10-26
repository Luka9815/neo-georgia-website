// Paths in content and route data stay relative to the site, not the host.
export function getPathPrefix(value = process.env.PATH_PREFIX || '/') {
  const prefix = `/${value.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(prefix)) {
    throw new Error('PATH_PREFIX must contain only slash-separated path segments.');
  }
  return prefix;
}

export function siteUrl(prefix = getPathPrefix()) {
  const value = process.env.SITE_URL || 'https://luka9815.github.io/neo-georgia-website/';
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTP(S) site URL without a query or fragment.');
  }
  if (process.env.SITE_URL && getPathPrefix(url.pathname) !== prefix) {
    throw new Error('SITE_URL pathname must match PATH_PREFIX.');
  }
  url.pathname = getPathPrefix(url.pathname);
  return url.href;
}

export function absoluteUrl(path, base) {
  return new URL(path.replace(/^\//, ''), base).href;
}
