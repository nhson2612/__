import * as orderService from '@functions/services/orderService';
import {getShopByShopifyDomain} from '@functions/services/shopService';
import {
  getLatestByShopId,
  create as createNotification
} from '@functions/repositories/notificationRepository';

/**
 * Check if shop has enough notifications, if not, fetch orders and create them
 * @param {string} shopDomain
 * @returns {Promise<void>}
 */
async function syncNotificationsForShop(shopDomain = 'dung-thanh-n.myshopify.com') {
  console.log(`>>>>>>>>>>>>> [SYNC NOTIFICATIONS] Checking shop: ${shopDomain}`);
  const shop = await getShopByShopifyDomain(shopDomain);
  if (!shop) {
    console.error(`>>>>>>>>>>>>> [SYNC NOTIFICATIONS] Shop not found: ${shopDomain}`);
    return;
  }

  const currentNotifications = await getLatestByShopId(shopDomain, 30);
  console.log(
    `>>>>>>>>>>>>> [SYNC NOTIFICATIONS] Current notifications count: ${currentNotifications.length}`
  );

  if (currentNotifications.length < 30) {
    const needed = 30 - currentNotifications.length;

    const orderResponse = await orderService.getLatestOrders(shop, 30);
    const orderEdges = orderResponse?.orders?.edges || [];
    console.log(`>>>>>>>>>>>>> [SYNC NOTIFICATIONS] Fetched ${orderEdges.length} orders.`);

    let countCreated = 0;
    for (const edge of orderEdges) {
      if (currentNotifications.length + countCreated >= 30) break;

      const order = edge?.node;
      if (!order) continue;

      const orderId = order.name || order.id;
      const exists = currentNotifications.some(n => n.orderId === orderId);
      if (!exists) {
        const firstItem = order.lineItems?.nodes?.[0] || null;
        const billingAddress = order.billingAddress || {};

        const notification = {
          shopId: shopDomain,
          orderId: orderId,
          firstName: billingAddress.firstName || 'Someone',
          city: billingAddress.city || '',
          country: billingAddress.country || '',
          productName: firstItem?.name || 'Product',
          productImage: firstItem?.product?.featuredImage?.url || '',
          timestamp: new Date(order.createdAt || Date.now())
        };

        await createNotification(notification);
        countCreated++;
      }
    }
  }
}

export default syncNotificationsForShop;
