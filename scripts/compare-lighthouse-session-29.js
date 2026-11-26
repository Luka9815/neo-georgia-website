import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const reports = process.argv.slice(2);
assert.ok(reports.length, 'Pass report files in chronological order.');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const key = ({ formFactor, lang, route }) => `${formFactor}/${lang}/${route}`;
const baseline = 'docs/review/session-28/lighthouse-comparison.json';
const latest = new Map();
for (const report of reports) {
  for (const row of read(report)) latest.set(key(row), { ...row, report });
}
assert.equal(latest.size, 24);
const rows = read(baseline).rows.map(row => {
  const sample = latest.get(key(row));
  assert.ok(sample, key(row));
  return {
    formFactor: row.formFactor, lang: row.lang, route: row.route,
    beforePerformance: row.afterPerformance, afterPerformance: sample.performance,
    beforeAccessibility: row.afterAccessibility, afterAccessibility: sample.accessibility,
    report: sample.report,
  };
});
const failures = rows.filter(row => row.afterPerformance < row.beforePerformance || row.afterAccessibility < row.beforeAccessibility);
writeFileSync('docs/review/session-29/lighthouse-comparison.json', JSON.stringify({ baseline, reports, rows }, null, 2) + '\n');
console.log(`${rows.length - failures.length}/${rows.length} targets met or exceeded Session 28.`);
for (const row of failures) console.log(JSON.stringify(row));
process.exitCode = failures.length ? 1 : 0;
