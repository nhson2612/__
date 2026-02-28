import {handleError} from '@assets/services/errorService';
import {api, auth} from '@assets/helpers';

export const storeTypes = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_TOAST: 'SET_TOAST',
  CLOSE_TOAST: 'CLOSE_TOAST',
  SET_SHOP: 'SET_SHOP',
  SET_SUBSCRIPTION: 'SET_SUBSCRIPTION'
};

export const reducer = (state, {type, payload}) => {
  switch (type) {
    case storeTypes.SET_USER:
      return {...state, user: payload};
    case storeTypes.SET_LOADING:
      return {...state, loading: payload};
    case storeTypes.SET_TOAST:
      return {...state, toast: payload};
    case storeTypes.CLOSE_TOAST:
      return {...state, toast: undefined};
    case storeTypes.SET_SHOP:
      return {...state, shop: payload};
    case storeTypes.SET_SUBSCRIPTION:
      return {...state, loading: false, subscription: payload};
    default:
      return state;
  }
};

/**
 * @param {Function} dispatch
 * @param {Boolean} payload
 */
export function setLoading(dispatch, payload = true) {
  dispatch(storeTypes.SET_LOADING, payload);
}

/**
 * @param {Function} dispatch
 * @param {String} content
 * @param {Error} error
 */
export function setToast(dispatch, content, error = false) {
  dispatch(storeTypes.SET_TOAST, {content, error});
}

/**
 * @param {Function} dispatch
 */
export function closeToast(dispatch) {
  dispatch(storeTypes.CLOSE_TOAST);
}

/**
 * @param {Function} dispatch
 * @param {Object} payload
 */
export function setUser(dispatch, payload = null) {
  dispatch(storeTypes.SET_USER, payload);
}

/**
 * @param {Function} dispatch
 * @param {Object} payload
 */
export function setShop(dispatch, payload = null) {
  dispatch(storeTypes.SET_SHOP, payload);
}

/**
 * @param {Function} dispatch
 */
export async function logout(dispatch) {
  try {
    setLoading(dispatch, true);
    await auth.signOut();
    window.location.href = '/auth/login';
  } catch (e) {
    handleError(e);
    setLoading(dispatch, false);
    setToast(dispatch, e.message, true);
  }
}

/**
 * @param {Function} dispatch
 * @param {Object} payload
 */
export function setSubscription(dispatch, payload = null) {
  dispatch(storeTypes.SET_SUBSCRIPTION, payload);
}

/**
 * @param {Function} dispatch
 * @return {Promise<*>}
 */
export async function getSubscription(dispatch) {
  try {
    setLoading(dispatch, true);
    const payload = await api('/subscription');
    setSubscription(dispatch, payload);
    return payload;
  } catch (e) {
    handleError(e);
    setLoading(dispatch, false);
  }
}
