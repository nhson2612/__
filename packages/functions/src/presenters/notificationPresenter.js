import moment from 'moment';

/**
 * Format date fields for presentation
 * @param {Object} data
 * @returns {Object}
 */
export function presentDataAndFormatDate(data) {
  if (!data) return data;
  
  const newData = {...data};
  
  if (newData.timestamp && newData.timestamp.toDate) {
    newData.timestamp = newData.timestamp.toDate();
  }
  
  // Format to relative time string if needed, or ISO string
  // For now keep it as Date object or string, JSON serialization will handle it
  
  return newData;
}
