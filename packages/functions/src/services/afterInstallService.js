import * as orderService from '@functions/services/orderService';
import {getShopByShopifyDomain} from '@functions/services/shopService';
import {initShopify} from '@functions/services/shopifyService';
import isWebhookExists from '@functions/helpers/webhook/webhookChecker';
import {create as createNotification} from '@functions/repositories/notificationRepository';
import appConfig from '@functions/config/app';

const NECESSARY_WEBHOOKS = ['orders/create'];
const WEBHOOK_ADDRESS = `https://${appConfig.baseUrl}/webhook/orders/new`;

export default async function afterInstallService(ctx) {
  const shopDomain = ctx?.state?.shopify?.shop || ctx?.query?.shop;

  if (!shopDomain) return;

  const shop = await getShopByShopifyDomain(shopDomain);
  if (!shop) return;

  try {
    const [shopify, orderResponse] = await Promise.all([
      initShopify(shop),
      orderService.getLatestOrders(shop)
    ]);

    const orderEdges = orderResponse?.orders?.edges || [];

    await registerWebhooks(shopify);

    const notifications = buildNotifications(orderEdges, shopDomain);

    await Promise.all(notifications.map(notification => createNotification(notification)));
  } catch (error) {
    console.error('[AFTER INSTALL ERROR]', error);
  }
}

async function registerWebhooks(shopify) {
  await Promise.all(
    NECESSARY_WEBHOOKS.map(async topic => {
      const exists = await isWebhookExists(shopify, topic);

      if (!exists) {
        return shopify.webhook.create({
          topic,
          address: WEBHOOK_ADDRESS,
          format: 'json'
        });
      }
    })
  );
}

function buildNotifications(orderEdges, shopDomain) {
  return orderEdges
    .map(edge => edge?.node)
    .filter(Boolean)
    .map(order => {
      const firstItem = order.lineItems?.nodes?.[0];
      const billing = order.billingAddress || {};

      return {
        shopId: shopDomain,
        orderId: order.name || order.id,
        firstName: billing.firstName || 'Someone',
        city: billing.city || '',
        country: billing.country || '',
        productName: firstItem?.name || 'Product',
        productImage: firstItem?.product?.featuredImage?.url || '',
        timestamp: new Date(order.createdAt || Date.now())
      };
    });
}
