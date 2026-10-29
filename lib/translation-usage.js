import {readFileSync} from 'node:fs';
import {files} from './placeholders.js';
// Include template, route, script and data references. Dynamic dictionary lookups
// retain the complete dictionary, including fixture-only/status choices.
export function translationReferences(){return ['src','lib','scripts'].flatMap(files).filter(p=>!/^src\/_data\/(ka|en)\.json$/.test(p)&&/\.(js|njk|json)$/.test(p)).map(p=>readFileSync(p,'utf8')).join('\n');}
export function unusedTranslationKeys(strings){const code=translationReferences();return Object.keys(strings).filter(key=>!new RegExp(`\\b${key}\\b`).test(code));}
