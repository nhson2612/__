import React, {createContext, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {getSubscription, reducer} from '@assets/actions/storeActions';
import {isShopUpgradable} from '@assets/services/shopService';

/** @type {React.Context<IStoreReducer>} */
const StoreReducer = createContext({});

export const useStore = () => useContext(StoreReducer);

/**
 * @param {object} props
 * @param {JSX.Element} props.children
 * @param {*} props.user
 * @param {Shop} props.activeShop
 * @return {JSX.Element}
 */
function StoreProvider({children, user, activeShop: shop}) {
  const initState = {user, shop};
  const [state, dispatch] = useReducer(reducer, initState);
  const handleDispatch = (type, payload = undefined) => dispatch({type, payload});

  window.activeShop = shop; // for debugging only

  useEffect(() => {
    if (window.location.pathname !== '/subscription' && isShopUpgradable(shop)) {
      getSubscription(handleDispatch).then();
    }
  }, []);

  return (
    <StoreReducer.Provider value={{state, dispatch: handleDispatch}}>
      {children}
    </StoreReducer.Provider>
  );
}
export {StoreProvider};
export default StoreProvider;

StoreProvider.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
  activeShop: PropTypes.any
};
