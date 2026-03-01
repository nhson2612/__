import * as eventService from '../../services/eventService';
import { handleError } from '../../helpers/errorHandler';

/**
 * Track an event from the storefront (click, view, etc.)
 * @param {Context} ctx
 */
export async function track(ctx) {
  try {
    const { shopifyDomain, notificationId, type, productId } = ctx.request.body;

    if (!shopifyDomain || !notificationId || !type) {
      ctx.status = 400;
      ctx.body = { success: false, error: 'Missing required fields' };
      return;
    }

    const eventId = await eventService.recordEvent(shopifyDomain, notificationId, type, {
      productId
    });

    ctx.body = { success: true, data: { eventId } };
  } catch (e) {
    console.error('Error tracking event:', e);
    handleError(ctx, e);
  }
}

/**
 * Track a conversion event from the Web Pixel
 * @param {Context} ctx
 */
export async function pixelConversion(ctx) {
  try {
    const { shopDomain, notifId, productId, orderId, revenue, currency } = ctx.request.body;

    if (!shopDomain || !notifId || !orderId) {
      ctx.status = 400;
      ctx.body = { success: false, error: 'Missing required pixel tracking fields' };
      return;
    }

    const eventId = await eventService.recordEvent(shopDomain, notifId, 'conversion', {
      productId,
      orderId: String(orderId),
      revenue,
      currency,
      source: 'web_pixel'
    });

    ctx.body = { success: true, eventId };
  } catch (e) {
    console.error('Error tracking pixel conversion:', e);
    handleError(ctx, e);
  }
}
