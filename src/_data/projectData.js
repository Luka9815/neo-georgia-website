import { loadProjectSnapshot } from '../../lib/projects.js';
export default function () {
  return { ...loadProjectSnapshot(), buildTime: new Date().toISOString() };
}
