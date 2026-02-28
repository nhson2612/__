import appRoute from '../const/app';
import isEmbeddedAppEnv from './isEmbeddedAppEnv';

/**
 * @param {String} url
 * @return {string}
 */
export function getUrl(url) {
  return (isEmbeddedAppEnv ? appRoute.embed : appRoute.standalone) + url;
}
