import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';

/**
 * Get first order line item image and name
 * @param {Object} shopify - Shopify API client
 * @param {string} orderId - Order ID (GraphQL format)
 * @param {number} firstLineItems - Number of line items to fetch
 * @returns {Promise<{productImageUrl: string, productName: string}>}
 */
export async function getOrderLineItemImage(shopify, orderId, firstLineItems = 10) {
  try {
    const orderQuery = loadGraphQL('/orderLineItemsImagesWithVariant.graphql');
    const orderGraphql = await shopify.graphql(orderQuery, {orderId, firstLineItems});
    const firstItemNode = orderGraphql?.order?.lineItems?.edges?.[0]?.node;

    return {
      productImageUrl:
        firstItemNode?.image?.url ||
        firstItemNode?.variant?.image?.url ||
        firstItemNode?.product?.featuredImage?.url ||
        '',
      productName: firstItemNode?.name || '',
      productHandle: firstItemNode?.product?.handle || '',
      productId: firstItemNode?.product?.id || ''
    };
  } catch (e) {
    console.error('Error getting order line item image:', e);
    throw e;
  }
}

/**
 * Convert webhook order to notification
 * @param {Object} params
 * @param {string} params.shopifyDomain - Shopify domain
 * @param {Object} params.order - Order data from webhook
 * @param {string} params.productName - Product name
 * @param {string} params.productImageUrl - Product image URL
 * @returns {{shopId: string, orderId: string, firstName: string, city: string, country: string, productName: string, productImage: string, timestamp: Date}}
 */
export function buildNotificationFromWebhookOrder({
  shopifyDomain,
  order,
  productName,
  productImageUrl,
  productHandle,
  productId
}) {
  const billingAddress = order?.billing_address || {};

  return {
    shopId: shopifyDomain,
    orderId: String(order?.id || ''),
    firstName: billingAddress.first_name || 'Someone',
    city: billingAddress.city || '',
    country: billingAddress.country || '',
    productName: productName || 'Product',
    productImage:
      productImageUrl ||
      'https://product.hstatic.net/200000410665/product/giay-the-thao-l82201-5_8cedfe64846b4bc6bef0f09105c8db3d.jpg',
    productHandle: productHandle || '',
    productId: productId || '',
    timestamp: new Date(order?.created_at || Date.now())
  };
}
