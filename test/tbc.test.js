import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(dir,entry.name)):[join(dir,entry.name)]).sort();
test('production HTML contains no public sample or draft markers',()=>{
 for(const file of files('_site').filter(file=>file.endsWith('.html')))assert.doesNotMatch(readFileSync(file,'utf8'),/\[(?:SAMPLE|DRAFT)\]/,file);
});
