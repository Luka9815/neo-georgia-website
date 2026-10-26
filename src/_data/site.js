export default function () {
  // Hosts provide their build URL. A reserved example domain prevents accidental production canonicals.
  const url = process.env.SITE_URL || process.env.CF_PAGES_URL || process.env.DEPLOY_PRIME_URL || 'https://example.org';
  return { url: new URL(url).origin, currentCallYear: 2026 };
}
