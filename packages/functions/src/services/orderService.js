import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';

/**
 * Get latest orders from shopify
 * @param shopData
 * @param first
 * @returns {Promise<*>}
 */
export const getLatestOrders = async (shopData, first = 10) => {
  const shopify = await initShopify(shopData);
  const orderQuery = loadGraphQL('/order.graphql');

  return shopify.graphql(orderQuery, {first});
};
