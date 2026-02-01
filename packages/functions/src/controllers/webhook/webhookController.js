import {create} from '../../repositories/notificationRepository';

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
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const order = ctx.request.body;

    // Basic validation
    if (!order || !order.id) {
      return (ctx.body = {success: true}); // Acknowledge anyway
    }

    const firstItem = order.line_items && order.line_items.length > 0 ? order.line_items[0] : null;
    const billingAddress = order.billing_address || {};

    const notificationData = {
      shopId: shopifyDomain,
      orderId: String(order.id),
      firstName: billingAddress.first_name || 'Someone',
      city: billingAddress.city || '',
      country: billingAddress.country || '',
      productName: firstItem ? firstItem.name : 'Product',
      productImage: '', // Webhook payload usually doesn't include image URL directly on line item
      timestamp: new Date(order.created_at || Date.now())
    };

    await create(notificationData);
    console.log(`Saved notification for order ${order.id} in shop ${shopifyDomain}`);

    return (ctx.body = {
      success: true
    });
  } catch (e) {
    console.error('Error handling new order webhook:', e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}
