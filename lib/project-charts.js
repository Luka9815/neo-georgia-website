// Pure build-time SVG. The adjacent HTML tables remain the complete equivalent.
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function organisationRanking(projects) {
 const organisations=new Map();
 for(const project of projects)for(const org of project.organisations)if(org.role!=='country-mobility') {
  if(!organisations.has(org.id))organisations.set(org.id,{name:org.name,projects:new Set()});
  organisations.get(org.id).projects.add(project.reference);
 }
 return [...organisations].map(([id,item])=>({id,label:item.name,count:item.projects.size})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label)||a.id.localeCompare(b.id)).slice(0,15);
}
export function chartRows(data,kind,t) {
 if(kind==='organisations')return organisationRanking(data.projects);
 return data.stats[kind].map(row=>({key:row.key,count:row.count,label:kind==='groups'?(row.action?t.projectActionLabels[row.action]:t.projectSectorLabels[row.sector]):kind==='statuses'?t.projectStatusLabels[row.key]:row.key}));
}
export function projectChart(rows,title,description,id) {
 if(!/^[a-z][a-z0-9-]*$/.test(id))throw new Error('Invalid chart ID');
 const max=Math.max(1,...rows.map(row=>row.count));
 let y=24;
 const marks=rows.map(row=>{
  if(!Number.isInteger(row.count)||row.count<0)throw new Error('Chart count must be non-negative');
  // Original long institution names wrap without clipping or abbreviating.
  const lines=[];let line='';
  for(const word of String(row.label).split(/\s+/)) {if(line.length+word.length>66&&line){lines.push(line);line='';}line+=(line?' ':'')+word;}
  if(line)lines.push(line);
  const label=lines.map((text,i)=>`<tspan x="16" dy="${i?20:0}">${escape(text)}</tspan>`).join('');
  const start=y;y+=lines.length*20+9;
  const bar=`<g data-chart-value="${row.count}" data-chart-label="${escape(row.label)}"><text x="16" y="${start}" class="chart-label">${label}</text><rect x="16" y="${y}" width="${(row.count/max*560).toFixed(2)}" height="16" rx="2"/><text x="${(28+row.count/max*560).toFixed(2)}" y="${y+14}" class="chart-value">${row.count}</text></g>`;
  y+=40;return bar;
 }).join('');
 return `<svg class="project-chart" role="img" viewBox="0 0 660 ${y}" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg"><title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(description)}</desc>${marks}</svg>`;
}
export function miniChart(rows,title,description,id) {
 const max=Math.max(1,...rows.map(row=>row.count));
 const marks=rows.map((row,index)=>{const x=24+index*47;const h=row.count/max*100;return `<g data-chart-value="${row.count}"><rect x="${x}" y="${132-h}" width="28" height="${h}"/><text x="${x+14}" y="${122-h}" text-anchor="middle">${row.count}</text><text x="${x+14}" y="157" text-anchor="middle">${escape(row.key)}</text></g>`;}).join('');
 return `<svg class="project-chart mini-chart" role="img" viewBox="0 0 660 180" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg"><title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(description)}</desc>${marks}</svg>`;
}
