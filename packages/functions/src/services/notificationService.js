import * as notificationRepository from '@functions/repositories/notificationRepository';
import * as notificationEventRepository from '@functions/repositories/notificationEventRepository';
import * as shopService from '@functions/services/shopService';
import {initShopify} from '@functions/services/shopifyService';
import * as eventService from './eventService';
import {
  buildNotificationFromWebhookOrder,
  getOrderLineItemImage
} from '@functions/helpers/notification/notificationMapper';

/**
 * Get list of notifications for a specific shop
 * @param {string} shopId
 * @param {object} params
 * @returns {Promise<{data: *[], pageInfo: {hasNext: boolean, hasPrev: boolean, firstElement: string, lastElement: string}}>}
 */
const getList = async (shopId, params = {}) => {
  const {limit, sort, direction, nextCursor, prevCursor} = params;
  const shopDomain = (await shopService.getShopById(shopId)).shopifyDomain;

  const notificationsData = await notificationRepository.getList(shopDomain, {
    limit,
    sort,
    direction,
    nextCursor,
    prevCursor
  });

  try {
    const stats = await eventService.getStatsPerNotification(shopDomain);
    notificationsData.data = notificationsData.data.map(notif => {
      const notifStats = stats[notif.id] || {
        view: 0,
        click: 0,
        conversion: 0,
        revenue: 0,
        ctr: 0,
        conversionRate: 0
      };
      return {...notif, stats: notifStats};
    });
  } catch (error) {
    console.error('Failed to attach stats to notifications:', error);
  }

  return notificationsData;
};

const deleteOne = async (id, shopId) => {
  const shopDomain = (await shopService.getShopById(shopId)).shopifyDomain;
  return await notificationRepository.deleteOne(id, shopDomain);
};

/**
 * Process a new order from webhook and create notification
 * @param {string} shopifyDomain - Shopify shop domain
 * @param {object} order - Order data from webhook
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const processWebhookOrder = async (shopifyDomain, order) => {
  if (!order || !order.id) {
    return {success: true};
  }

  try {
    const orderedProductIds = (order.line_items || []).map(item => String(item.product_id));
    const revenue = parseFloat(order.total_price);
    const revenuePerItem = orderedProductIds.length > 0 ? revenue / orderedProductIds.length : 0;

    // Deduplicate product IDs in case of multiple quantities
    const uniqueProductIds = [...new Set(orderedProductIds)];

    for (const productId of uniqueProductIds) {
      const hasClicks = await notificationEventRepository.hasClicksForProduct(
        shopifyDomain,
        productId
      );
      if (!hasClicks) continue;

      const allNotifications = await notificationRepository.getLatestByShopId(shopifyDomain);
      const matchedNotif = allNotifications.find(n => {
        if (!n.productId) return false;
        return String(n.productId).includes(productId);
      });

      if (matchedNotif) {
        await eventService.recordEvent(shopifyDomain, matchedNotif.id, 'conversion', {
          orderId: order.id.toString(),
          productId: matchedNotif.productId,
          totalPrice: order.total_price,
          currency: order.currency,
          revenue: revenuePerItem
        });
      }
    }
  } catch (error) {
    console.error('Failed to record conversion event:', error);
  }

  const shop = await shopService.getShopByShopifyDomain(shopifyDomain);
  if (!shop) {
    console.error('Shop not found for domain:', shopifyDomain);
    return {success: true};
  }

  const firstItem = order.line_items?.[0] || null;
  let productImageUrl = '';
  let productName = firstItem?.name || '';

  let imageResult = null;
  try {
    const shopify = initShopify(shop);
    const orderId = `gid://shopify/Order/${order.id}`;
    imageResult = await getOrderLineItemImage(shopify, orderId, 10);
    productImageUrl = imageResult.productImageUrl;
    productName = imageResult.productName || productName;
  } catch (error) {
    console.error('Failed to load order line item images:', error);
    return {success: false};
  }

  const notificationData = buildNotificationFromWebhookOrder({
    shopifyDomain,
    order,
    productName,
    productImageUrl,
    productHandle: imageResult?.productHandle || '',
    productId: imageResult?.productId || ''
  });

  await notificationRepository.create(notificationData);

  return {success: true};
};

export default {
  getList,
  deleteOne,
  processWebhookOrder
};
