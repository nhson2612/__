import {getCurrentShop} from '../helpers/auth';
import notificationService from '@functions/services/notificationService';
import {handleError} from '@functions/helpers/errorHandler';

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
    handleError(ctx, e);
  }
}

export async function deleteNotification(ctx) {
  try {
    const {id} = ctx.params;
    const shopId = getCurrentShop(ctx);
    const success = await notificationService.deleteOne(id, shopId);
    ctx.body = {success};
  } catch (e) {
    handleError(ctx, e);
  }
}
