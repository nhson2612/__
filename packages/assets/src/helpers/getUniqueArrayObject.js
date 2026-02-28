/**
 * @param {Array} array
 * @param {*} key
 * @return {array}
 */
export function getUniqueArrayObject(array, key) {
  const uniqueIds = new Set();

  return array.filter(obj => {
    if (!uniqueIds.has(obj[key])) {
      uniqueIds.add(obj[key]);
      return true;
    }
    return false;
  });
}
