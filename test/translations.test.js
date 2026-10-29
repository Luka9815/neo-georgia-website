import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {unusedTranslationKeys} from '../lib/translation-usage.js';
const read=lang=>JSON.parse(readFileSync(`src/_data/${lang}.json`));
const paths=(value,prefix='')=>Object.entries(value).flatMap(([key,child])=>child&&typeof child==='object'&&!Array.isArray(child)?paths(child,prefix+key+'.'):[prefix+key]).sort();
test('both translation dictionaries have identical keys and no unused interface keys',()=>{
 assert.deepEqual(paths(read('ka')),paths(read('en')));assert.deepEqual(unusedTranslationKeys(read('en')),[]);
});
