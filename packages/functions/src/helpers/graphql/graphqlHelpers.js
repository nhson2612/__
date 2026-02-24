import {readFileSync} from 'fs';
import path from 'path';

/**
 *
 * @param relativePath
 * @returns {string}
 */
export function loadGraphQL(relativePath) {
  return readFileSync(path.join(__dirname, '../../graphql', relativePath), 'utf8');
}
