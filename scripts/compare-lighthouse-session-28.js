// Compare the latest chronological sample per target. Keep every source report.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const directory = 'docs/review/session-28';
const baselineFile = 'docs/review/session-27/after/lighthouse.json';
const reports = process.argv.slice(2);
assert.ok(reports.length, 'Pass report files in chronological order.');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const key = row => `${row.formFactor}/${row.lang}/${row.route}`;
const latest = new Map();
for (const report of reports) {
  for (const sample of read(report)) latest.set(key(sample), { ...sample, report });
}
const baseline = read(baselineFile);
assert.equal(baseline.length, 24);
assert.equal(latest.size, baseline.length);
const rows = baseline.map(({ formFactor, lang, route, performance, accessibility }) => {
  const sample = latest.get(key({ formFactor, lang, route }));
  assert.ok(sample, `${formFactor}/${lang}/${route}`);
  return {
    formFactor, lang, route,
    beforePerformance: performance, afterPerformance: sample.performance,
    beforeAccessibility: accessibility, afterAccessibility: sample.accessibility,
    report: sample.report,
  };
});
const failures = rows.filter(row =>
  row.afterPerformance < row.beforePerformance || row.afterAccessibility < row.beforeAccessibility);
writeFileSync(`${directory}/lighthouse-comparison.json`, JSON.stringify({ baseline: baselineFile, reports, rows }, null, 2) + '\n');
console.log(`${rows.length - failures.length}/${rows.length} final targets meet or exceed the Session 27 performance and accessibility scores.`);
for (const failure of failures) console.log(JSON.stringify(failure));
process.exitCode = failures.length > 0 ? 1 : 0;
