import { getPathSegments } from '@sogody/experiment-framework/framework';

const TRACKING_PROJECT = 'playground-sample';
const TRACKING_DESCRIPTION = 'sample button experiment';

export const getTrackingLabel = (experience, action, pathname) => {
  const segments = getPathSegments(pathname);
  const buyIndex = segments.indexOf('buy');
  const product = segments[buyIndex - 1] ?? 'galaxy-z';
  const pageType = buyIndex >= 0 ? 'buy page' : 'product finder page';

  return `${experience}: ${product}: ${pageType}: ${TRACKING_PROJECT}: ${TRACKING_DESCRIPTION}: ${action}`;
};
