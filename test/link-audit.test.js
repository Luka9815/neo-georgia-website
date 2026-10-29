import test from 'node:test';
import assert from 'node:assert/strict';
import {selectLinks} from '../scripts/check-links.js';
test('manual link audit retains all authored links and samples projects without replacement',()=>{
 const references=new Map(Array.from({length:300},(_,i)=>[`https://example.org/${i}`,new Set(['/en/'])]));
 const generated=new Set([...references.keys()].slice(0,250));
 const selected=selectLinks(references,generated,200,()=>0);
 assert.equal(selected.handEntered.length,50);assert.equal(selected.projects.length,200);assert.equal(selected.generatedTotal,250);
 assert.equal(new Set(selected.projects.map(([url])=>url)).size,200);
 assert.equal(selectLinks(references,generated,0).projects.length,0);
 assert.equal(selectLinks(references,generated,999).projects.length,250);
 for(const size of [-1,1.5,NaN])assert.throws(()=>selectLinks(references,generated,size),/PROJECT_SAMPLE_SIZE/);
});
