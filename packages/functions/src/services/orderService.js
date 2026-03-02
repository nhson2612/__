import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';

/**
 * Get latest orders from shopify
 * @param shopData
 * @param first
 * @returns {Promise<*>}
 */
export const getLatestOrders = async (shopData, first = 30) => {
  const shopify = initShopify(shopData);
  const orderQuery = loadGraphQL('/order.graphql');

  return shopify.graphql(orderQuery, {first});
};

/**
 * Get orders within the last N days (for co-purchase calculation)
 * @param shopData
 * @param {Object} options
 * @param {number} [options.days=30] - Lookback window in days
 * @param {number} [options.first=100] - Number of orders per page
 * @param {string|null} [options.after=null] - Cursor for pagination
 * @param {number} [options.firstLineItems=50] - Line items per order
 * @returns {Promise<*>}
 */
export const getOrdersByDateRange = async (
  shopData,
  {days = 30, first = 100, after = null, firstLineItems = 50} = {}
) => {
  const shopify = initShopify(shopData);
  const orderQuery = loadGraphQL('/ordersByDateRange.graphql');

  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const query = `created_at:>=${sinceDate}`;

  return shopify.graphql(orderQuery, {
    first,
    after,
    firstLineItems,
    query
  });
};

/**
 * Get orders by custom Shopify search query
 * @param shopData
 * @param {Object} options
 * @param {string} options.query - Shopify order search query
 * @param {number} [options.first=100]
 * @param {string|null} [options.after=null]
 * @param {number} [options.firstLineItems=50]
 * @returns {Promise<*>}
 */
export const getOrdersByQuery = async (
  shopData,
  {query, first = 100, after = null, firstLineItems = 50} = {}
) => {
  const shopify = initShopify(shopData);
  const orderQuery = loadGraphQL('/ordersByDateRange.graphql');

  return shopify.graphql(orderQuery, {
    first,
    after,
    firstLineItems,
    query
  });
};
