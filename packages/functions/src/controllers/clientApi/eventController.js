import * as eventService from '../../services/eventService';
import {handleError} from '../../helpers/errorHandler';

/**
 * Track an event from the storefront
 * @param {Context} ctx
 */
export async function track(ctx) {
  try {
    const {shopifyDomain, notificationId, type, productId} = ctx.request.body;

    if (!shopifyDomain || !notificationId || !type) {
      ctx.status = 400;
      ctx.body = {success: false, error: 'Missing required fields'};
      return;
    }

    const eventId = await eventService.recordEvent(shopifyDomain, notificationId, type, {
      productId
    });

    ctx.body = {
      success: true,
      data: {eventId}
    };
  } catch (e) {
    console.error('Error tracking event:', e);
    handleError(ctx, e);
  }
}
