import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
test('rejected search experiment does not publish indexes or a runtime search interface', () => {
  assert.equal(existsSync('_site/pagefind'), false);
  for (const file of files('_site').filter(path => path.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /<script[^>]+src=["'][^"']*pagefind|id=["']search["']/i, file);
  }
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(pkg.scripts.build, 'eleventy');
});
