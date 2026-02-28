import {useState} from 'react';
import {api} from '@assets/helpers';
import {useStore} from '@assets/reducers/storeReducer';
import {setToast} from '@assets/actions/storeActions';
import {handleError} from '@assets/services/errorService';

/**
 * Update a resource via PUT and manage loading/toast state.
 * @param {string} url
 * @param {boolean | object} [defaultState=false]
 * @param {boolean} [fullResp=false]
 * @param {boolean} [useToast=true]
 * @param {function(object): void} [successCallback=(_p) => {}]
 * @param {string} [successMsg='Saved successfully']
 * @param {string} [errorMsg='Failed to save']
 * @returns {{editing: boolean, handleEdit: function(object, boolean | string): Promise<boolean | object>}}
 */
export default function useEditApi({
  url,
  defaultState = false,
  fullResp = false,
  useToast = true,
  successCallback = _p => {},
  successMsg = 'Saved successfully',
  errorMsg = 'Failed to save'
}) {
  const {dispatch} = useStore();
  const [editing, setEditing] = useState(defaultState);

  /**
   * Send update request with payload and control editing state.
   * @param {object} data
   * @param {boolean | string} [newEditing=true]
   * @returns {Promise<boolean | {success: boolean, error?: string}>}
   */
  const handleEdit = async (data, newEditing = true) => {
    try {
      setEditing(prev =>
        typeof newEditing === 'boolean' ? newEditing : {...prev, [newEditing]: true}
      );
      const resp = await api(url, {body: data, method: 'PUT'});
      if (resp.success && useToast) {
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
      setEditing(prev =>
        typeof newEditing === 'boolean' ? !newEditing : {...prev, [newEditing]: false}
      );
    }
  };

  return {editing, handleEdit};
}
