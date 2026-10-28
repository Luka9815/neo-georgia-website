import { loadMappedProjects } from '../../lib/projects.js';
export default function () {
  return { ...loadMappedProjects(), buildTime: new Date().toISOString() };
}
