import * as notificationRepository from '../repositories/notificationRepository';
import {getCurrentShop} from '../helpers/auth';

/**
 * Get list of notifications
 * @param {Context} ctx
 */
export async function getList(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const {limit, sort, direction, nextCursor, prevCursor} = ctx.query;
    
    const result = await notificationRepository.getList(shopId, {
      limit: limit ? parseInt(limit) : 10,
      sort,
      direction,
      nextCursor,
      prevCursor
    });
    
    ctx.body = result;
  } catch (e) {
    console.error('getNotifications Error:', e);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
}

/**
 * Manual sync trigger (placeholder for now)
 * @param {Context} ctx
 */
export async function sync(ctx) {
  // This would typically trigger a background job to fetch old orders
  // For now we just return success
  ctx.body = {
    success: true,
    message: 'Sync started'
  };
}
