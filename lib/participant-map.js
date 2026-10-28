import {readFileSync} from 'node:fs';
import locations from '../src/_data/cityLocations.json' with {type:'json'};
const outline=JSON.parse(readFileSync(new URL('../src/assets/maps/georgia.geojson',import.meta.url),'utf8'));
const normalise=value=>value.normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();
const aliases=new Map();
for(const city of locations.cities)for(const alias of city.aliases) {
 const key=normalise(alias);
 if(aliases.has(key)&&aliases.get(key).slug!==city.slug)throw new Error(`Conflicting reviewed city alias: ${alias}`);
 aliases.set(key,city);
}
export function participantCities(projects) {
 const organisations=new Map();
 for(const project of projects)for(const org of project.organisations)if(org.role!=='country-mobility') {
  if(!organisations.has(org.id))organisations.set(org.id,new Set());
  if(org.city.trim())organisations.get(org.id).add(org.city.trim());
 }
 const counts=new Map();const unresolved=new Map();
 for(const names of organisations.values()) {
  const matches=[...names].map(name=>aliases.get(normalise(name)));
  const slugs=new Set(matches.filter(Boolean).map(city=>city.slug));
  // A missing historical city is harmless when all known values agree.
  // Different named locations, or unreviewed spellings, never get guessed.
  if(names.size&&matches.every(Boolean)&&slugs.size===1) {
   const city=matches[0];counts.set(city.slug,{...city,count:(counts.get(city.slug)?.count||0)+1});
  } else {
   const reason=!names.size?'missing':slugs.size>1?'conflict':'unmapped';
   const label=[...names].sort().join(' / ');const key=`${reason}:${label}`;
   unresolved.set(key,{reason,label,count:(unresolved.get(key)?.count||0)+1});
  }
 }
 const cities=[...counts.values()].sort((a,b)=>b.count-a.count||a.slug.localeCompare(b.slug));
 const unknown=[...unresolved.values()].reduce((sum,row)=>sum+row.count,0);
 return {cities,unknown,total:organisations.size,unresolved:[...unresolved.values()].sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label))};
}
const project=([lon,lat])=>[40+(lon-39.5)*100,40+(44-lat)*130];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function participantMap(data,t,lang) {
 if(outline.geometry.type!=='Polygon'||outline.geometry.coordinates.length!==1)throw new Error('Georgia map requires a reviewed whole outline without internal borders');
 const d=outline.geometry.coordinates[0].map((point,i)=>`${i?'L':'M'}${project(point).map(n=>n.toFixed(2)).join(',')}`).join(' ')+'Z';
 const bubbles=[...data.cities.map(city=>({...city,point:project([city.longitude,city.latitude]),label:city[lang]})),...(data.unknown?[{slug:'unknown',count:data.unknown,point:[620,48],label:t.mapUnknown}]:[])];
 const marks=bubbles.map(city=>{
  const [x,y]=city.point;const r=Math.sqrt(city.count)*1.65;
  return `<a href="#city-${city.slug}" aria-label="${escape(city.label)}: ${city.count}" data-map-count="${city.count}" data-map-city="${city.slug}"><title>${escape(city.label)}: ${city.count}</title><circle class="map-target" cx="${x}" cy="${y}" r="${Math.max(r,12)}"/><circle class="map-bubble" cx="${x}" cy="${y}" r="${r.toFixed(3)}"/>${city.count>=15||city.slug==='unknown'?`<text x="${x}" y="${y-r-10}" text-anchor="middle">${escape(city.slug==='unknown'?t.mapUnknownShort:city.label)} (${city.count})</text>`:''}</a>`;
 }).join('');
 return `<svg class="participant-map" role="group" viewBox="0 0 800 460" xmlns="http://www.w3.org/2000/svg" aria-labelledby="map-${lang}-title map-${lang}-desc"><title id="map-${lang}-title">${escape(t.participantMap)}</title><desc id="map-${lang}-desc">${escape(t.mapDescription)}</desc><path class="georgia-outline" d="${d}"/>${marks}</svg>`;
}
