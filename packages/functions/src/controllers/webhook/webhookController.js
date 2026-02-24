import notificationService from '@functions/services/notificationService';
import {handleError} from '@functions/helpers/errorHandler';

/**
 * Handle app/uninstalled webhook
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function appUninstalled(ctx) {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    console.log(`App uninstalled for shop: ${shopifyDomain}`);

    ctx.body = {success: true};
  } catch (e) {
    handleError(ctx, e);
  }
}

/**
 * Handle orders/create webhook
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function listenNewOrder(ctx) {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const order = ctx.req.body;

    const result = await notificationService.processWebhookOrder(shopifyDomain, order);
    ctx.body = result;
  } catch (e) {
    console.error('Error handling new order webhook:', e);
    handleError(ctx, e);
  }
}
