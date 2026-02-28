import {useState} from 'react';
import {api} from '@assets/helpers';
import {useStore} from '@assets/reducers/storeReducer';
import {setToast} from '@assets/actions/storeActions';
import {handleError} from '@assets/services/errorService';

/**
 * Create a resource via POST and manage loading/toast state.
 * @param {string} url
 * @param {boolean} [fullResp=false]
 * @param {function(object): void} [successCallback=() => {}]
 * @param {string} [successMsg='Saved successfully']
 * @param {string} [errorMsg='Failed to save']
 * @returns {{creating: boolean, handleCreate: function(object): Promise<boolean | object>}}
 */
export default function useCreateApi({
  url,
  fullResp = false,
  successCallback = () => {},
  successMsg = 'Saved successfully',
  errorMsg = 'Failed to save'
}) {
  const {dispatch} = useStore();
  const [creating, setCreating] = useState(false);

  /**
   * Send create request with payload.
   * @param {object} data
   * @returns {Promise<boolean | {success: boolean, error?: string}>}
   */
  const handleCreate = async data => {
    try {
      setCreating(true);
      const resp = await api(url, {body: data, method: 'POST'});
      if (resp.success) {
        setToast(dispatch, resp.message || successMsg);
        successCallback(resp);
      }
      if (resp.error) {
        setToast(dispatch, resp.error, true);
      }
      return fullResp ? resp : resp.success;
    } catch (e) {
      handleError(e);
      setToast(dispatch, errorMsg, true);
      return fullResp ? {success: false, error: e.message} : false;
    } finally {
      setCreating(false);
    }
  };

  return {creating, handleCreate};
}
