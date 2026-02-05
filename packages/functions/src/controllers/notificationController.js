import {getCurrentShop} from '../helpers/auth';
import notificationService from '@functions/services/notificationService';

/**
 * Get list of notifications
 * @param {Context} ctx
 */
export async function getList(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const {limit, sort, direction, nextCursor, prevCursor} = ctx.query;
    const parsedLimit = limit ? parseInt(limit, 10) : 10;

    ctx.body = await notificationService.getList(shopId, {
      limit: parsedLimit,
      sort,
      direction,
      nextCursor,
      prevCursor
    });
  } catch (e) {
    console.error('getNotifications Error:', e);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
}
