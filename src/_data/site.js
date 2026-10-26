import { getPathPrefix, siteUrl } from '../../lib/urls.js';

export default function () {
  return {
    url: siteUrl(),
    pathPrefix: getPathPrefix(),
    currentCallYear: 2026,
  };
}
