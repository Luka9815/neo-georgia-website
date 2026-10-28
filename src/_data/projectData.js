import { loadMappedProjects } from '../../lib/projects.js';
export default function () {
  const data = loadMappedProjects();
  const years = [...new Set(data.projects.map(project => project.year))].sort((a, b) => b - a);
  const yearGroups = years.map(year => {
    const projects = data.projects.filter(project => project.year === year);
    const groups = Object.entries(Object.groupBy(projects, project => project.group))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, items]) => ({ key, action: items[0].action, sector: items[0].sector,
        projects: items.sort((a, b) => a.reference.localeCompare(b.reference)) }));
    return { year, count: projects.length, groups };
  });
  const actions = [...new Set(data.projects.map(project => project.action).filter(Boolean))].sort();
  const actionYears = Object.fromEntries(actions.map(action => [action, years.map(year => ({
    year, count: data.projects.filter(project => project.action === action && project.year === year).length,
  })).filter(item => item.count)]));
  return { ...data, years, yearGroups, actionYears, buildTime: new Date().toISOString() };
}
