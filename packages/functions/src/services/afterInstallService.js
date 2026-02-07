import * as orderService from '@functions/services/orderService';
import { getShopByShopifyDomain } from '@functions/services/shopService';
import { initializeShopSettings } from '@functions/services/settingService';
import { initShopify } from '@functions/services/shopifyService';
import isWebhookExists from '@functions/helpers/webhook/webhookChecker';
import { create as createNotification } from '@functions/repositories/notificationRepository';

const necessaryWebhooks = ['orders/create'];

export default async function afterInstallService(ctx) {
  console.log('>>>>>>>>>>>>> [AFTER INSTALL] ctx.query.shop:', ctx?.query?.shop);
  console.log(
    '>>>>>>>>>>>>> [AFTER INSTALL] ctx.state.shopify.shop.shopifyDomain:',
    ctx?.state?.shopify?.shop?.shopifyDomain
  );
  const shopDomain = ctx?.state?.shopify?.shop || ctx?.query?.shop;
  const shop = await getShopByShopifyDomain(shopDomain);

  try {
    if (!shop) {
      console.error('>>>>>>>>>>>>> [AFTER INSTALL] Shop not found:', shopDomain);
      return;
    }

    const shopify = await initShopify(shop);
    const settings = await initializeShopSettings(shop.id);
    const maxPopups = parseInt(settings?.display?.maxPopups, 30);
    const orderResponse = await orderService.getLatestOrders(shop, maxPopups);
    const orderEdges = orderResponse?.orders?.edges || [];

    // Skip webhook check in development - webhooks registered by @avada/core
    for (const webhook of necessaryWebhooks) {
      const exists = await isWebhookExists(shopify, webhook);
      if (!exists) {
        throw new Error(
          `Webhook ${webhook} does not exist.\n Please register it manually in Shopify admin.`
        );
      }
    }

    const notifications = [];
    for (const edge of orderEdges) {
      const order = edge?.node;
      if (!order) {
        continue;
      }
      const firstItem = order.lineItems?.nodes?.[0] || null;
      const billingAddress = order.billingAddress || {};

      notifications.push({
        shopId: shopDomain,
        orderId: order.name || order.id,
        firstName: billingAddress.firstName || 'Someone',
        city: billingAddress.city || '',
        country: billingAddress.country || '',
        productName: firstItem?.name || 'Product',
        productImage: firstItem?.product?.featuredImage?.url || '',
        timestamp: new Date(order.createdAt || Date.now())
      });
    }
    for (const notification of notifications) {
      await createNotification(notification);
    }
    console.log(
      '>>>>>>>>>>>>> [AFTER INSTALL] Shop:',
      shopDomain,
      'Notifications created:',
      notifications.length,
      'Default settings:',
      settings
    );
  } catch (e) {
    console.error('>>>>>>>>>>>>> [ERROR] ', e);
  }
}
