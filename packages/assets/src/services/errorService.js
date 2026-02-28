import {setToast} from '@assets/actions/storeActions';

/**
 * Handle API error
 * @param {Error} error
 * @param {Object} dispatch
 */
export function handleError(error, dispatch) {
  const data = error?.response?.data;
  const message = data?.error?.message || data?.error || error.message;
  console.error('API Error:', message);
  if (dispatch) {
    setToast(dispatch, message, true);
  }
}
