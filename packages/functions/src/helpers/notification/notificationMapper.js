import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';

/**
 *
 * {
 *   "data": {
 *     "order": {
 *       "id": "gid://shopify/Order/6514197037284",
 *       "name": "#1012",
 *       "lineItems": {
 *         "edges": [
 *           {
 *             "node": {
 *               "id": "gid://shopify/LineItem/15594221142244",
 *               "name": "Selling Plans Ski Wax - Selling Plans Ski Wax",
 *               "image": {
 *                 "url": "https://cdn.shopify.com/s/files/1/0793/3044/3492/files/snowboard_wax.png?v=1769735879",
 *                 "altText": "A bar of golden yellow wax"
 *               },
 *               "variant": {
 *                 "id": "gid://shopify/ProductVariant/47520926531812",
 *                 "image": null
 *               },
 *               "product": {
 *                 "id": "gid://shopify/Product/8903349108964",
 *                 "featuredImage": {
 *                   "url": "https://cdn.shopify.com/s/files/1/0793/3044/3492/files/snowboard_wax.png?v=1769735879",
 *                   "altText": "A bar of golden yellow wax"
 *                 }
 *               }
 *             }
 *           }
 *         ]
 *       }
 *     }
 *   },
 *   "extensions": {
 *     "cost": {
 *       "requestedQueryCost": 27,
 *       "actualQueryCost": 6,
 *       "throttleStatus": {
 *         "maximumAvailable": 2000,
 *         "currentlyAvailable": 1994,
 *         "restoreRate": 100
 *       }
 *     }
 *   }
 * }
 *
 * */

export async function getOrderLineItemImage(shopify, orderId, firstLineItems = 10) {
  console.log('[GET-ORDER-LINE-ITEM-IMAGE] START', {orderId});
  try {
    const orderQuery = loadGraphQL('/orderLineItemsImagesWithVariant.graphql');
    console.log('[GET-ORDER-LINE-ITEM-IMAGE] Query loaded');
    const orderGraphql = await shopify.graphql(orderQuery, {orderId, firstLineItems});
    console.log('[GET-ORDER-LINE-ITEM-IMAGE] GraphQL executed');
    const firstItemNode = orderGraphql?.order?.lineItems?.edges?.[0]?.node;
    console.log('[GET-ORDER-LINE-ITEM-IMAGE] firstItemNode: ', firstItemNode, '');
    return {
      productImageUrl:
        firstItemNode?.image?.url ||
        firstItemNode?.variant?.image?.url ||
        firstItemNode?.product?.featuredImage?.url ||
        '',
      productName: firstItemNode?.name || ''
    };
  } catch (e) {
    console.error('[GET-ORDER-LINE-ITEM-IMAGE] ERROR:', e);
    throw e;
  }
}

export function buildNotificationFromWebhookOrder({
  shopifyDomain,
  order,
  productName,
  productImageUrl
}) {
  const billingAddress = order?.billing_address || {};

  return {
    shopId: shopifyDomain,
    orderId: String(order?.id || ''),
    firstName: billingAddress.first_name || 'Someone',
    city: billingAddress.city || '',
    country: billingAddress.country || '',
    productName: productName || 'Product',
    productImage: productImageUrl || '',
    timestamp: new Date(order?.created_at || Date.now())
  };
}
