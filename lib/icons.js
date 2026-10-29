import {readFileSync} from 'node:fs';
export const actionIcons = {'icm':'globe','erasmus-mundus':'graduation-cap','cbhe':'building','jean-monnet':'book-open','cb-vet':'wrench','cb-youth':'users','youth-mobility':'network','virtual-exchanges':'messages-square','cb-sport':'trophy'};
const cache = new Map();
export function icon(name) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error('Invalid icon name');
  if (!cache.has(name)) {
    const source = readFileSync(new URL(`../src/assets/icons/${name}.svg`,import.meta.url),'utf8');
    cache.set(name,`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${source.slice(source.indexOf('>')+1,source.lastIndexOf('</svg>'))}</svg>`);
  }
  return cache.get(name);
}
