import {getCurrentShop} from '../helpers/auth';
import {getShopById, getShopInfoByShopId} from '@functions/services/shopService';

export async function getUserShops(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    console.log('Get user shops', shopId);
    const shop = await getShopById(shopId);
    const shopInfo = await getShopInfoByShopId(shopId);
    ctx.body = {shop, shopInfo};
  } catch (e) {
    console.error(e);
    ctx.body = {shop: null, shopInfo: null};
  }
}
