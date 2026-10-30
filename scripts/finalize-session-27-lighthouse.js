// Use the latest measurement of each target, never the maximum score.
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const reports=process.argv.slice(2),latest=new Map();
assert.ok(reports.length,'Pass reports in chronological order.');
for(const report of reports)for(const row of JSON.parse(readFileSync(report))){
 const key=`${row.formFactor}/${row.lang}/${row.route}`;latest.set(key,{...row,report});
}
assert.equal(latest.size,24,'The complete matrix must contain 24 targets.');
writeFileSync('docs/review/session-27/after/lighthouse.json',JSON.stringify([...latest.values()],null,2)+'\n');
writeFileSync('docs/review/session-27/lighthouse-reports.json',JSON.stringify({method:'Latest chronological sample per target, not the maximum. All original reports retained.',reports},null,2)+'\n');
