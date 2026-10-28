import {loadMappedProjects} from '../../lib/projects.js';
import {participantCities} from '../../lib/participant-map.js';
export default ()=>participantCities(loadMappedProjects().projects);
