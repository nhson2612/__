import {create} from '../../repositories/notificationRepository';
import {initShopify} from '@functions/services/shopifyService';
import {getShopByShopifyDomain} from '@functions/services/shopService';
import {
  buildNotificationFromWebhookOrder,
  getOrderLineItemImage
} from '@functions/helpers/notification/notificationMapper';

/**
 * Handle app/uninstalled webhook
 * @param ctx
 * @returns {Promise<{success: boolean}>}
 */
export async function appUninstalled(ctx) {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    // TODO: Handle app uninstallation logic here
    // Example: Mark shop as uninstalled, cleanup data, etc.
    console.log(`App uninstalled for shop: ${shopifyDomain}`);

    return (ctx.body = {
      success: true
    });
  } catch (e) {
    console.error(e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}

/**
 * Handle orders/create webhook
 * @param ctx
 * @returns {Promise<{success: boolean}>}
 */
export async function listenNewOrder(ctx) {
  console.log('>>>>>>>>>>>>>> HANDLE NEW ORDER WEBHOOK <<<<<<<<<<<<<<<<');
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const order = ctx.request.body;
    console.log(
      '>>>>>>>>>>>>>>> ORDER FROM WEBHOOK: ',
      JSON.stringify(order, null, 2),
      ' <<<<<<<<<<<<<<<<'
    );
    if (!order || !order.id) {
      return (ctx.body = {success: true});
    }

    const shop = await getShopByShopifyDomain(shopifyDomain);
    if (!shop) {
      console.error('Shop not found for domain:', shopifyDomain);
      return (ctx.body = {success: true});
    }

    const firstItem = order.line_items && order.line_items.length > 0 ? order.line_items[0] : null;
    let productImageUrl = '';
    let productName = firstItem ? firstItem.name : '';
    try {
      const shopify = await initShopify(shop);
      const orderId = `gid://shopify/Order/${order.id}`;
      const imageResult = await getOrderLineItemImage(shopify, orderId, 10);
      productImageUrl = imageResult.productImageUrl;
      productName = imageResult.productName || productName;
    } catch (error) {
      console.error('Failed to load order line item images:', error);
    }

    const notificationData = buildNotificationFromWebhookOrder({
      shopifyDomain,
      order,
      productName,
      productImageUrl
    });

    await create(notificationData);
    console.log(
      `>>>>>>>>>> Saved notification for order ${order.id} in shop ${shopifyDomain} <<<<<<<<<<`
    );

    return (ctx.body = {
      success: true
    });
  } catch (e) {
    console.error('>>>>>>>>>>>> Error handling new order webhook:', e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}
