import {getCurrentShop} from '../helpers/auth';
import {getShopById, getShopInfoByShopId} from '@functions/services/shopService';
import {handleError} from '../helpers/errorHandler';

/**
 * Get current user's shop information
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function getUserShops(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shop = await getShopById(shopId);
    const shopInfo = await getShopInfoByShopId(shopId);
    ctx.body = {shop, shopInfo};
  } catch (e) {
    handleError(ctx, e);
  }
}
