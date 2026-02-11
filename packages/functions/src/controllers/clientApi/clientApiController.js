import { getShopByShopifyDomain } from '@functions/services/shopService';
import { getSettings } from '../../services/settingService';
import { getLatestByShopId } from '../../repositories/notificationRepository';

export async function getNotifications(ctx) {
  try {
    const {shopifyDomain} = ctx.query;
    console.log('>>>>>>>>>>> GETTING NOTIFICATIONS FOR SHOP: ', shopifyDomain, ' <<<<<<<<<<<<');
    if (!shopifyDomain) {
      ctx.status = 400;
      ctx.body = {success: false, error: 'Missing shopifyDomain'};
      return;
    }

    const shop = await getShopByShopifyDomain(shopifyDomain);
    if (!shop) {
      ctx.status = 404;
      ctx.body = {success: false, error: 'Shop not found'};
      return;
    }

    const settings = await getSettings(shop.id);
    const notifications = await getLatestByShopId(shopifyDomain, 30);
    console.log('>>>>>>>>>>>>> NOTIFICATIONS', notifications);
    console.log('>>>>>>>>>>>>> EXPECTED RESPONSE', {
      success: true,
      data: {
        settings: settings || {},
        notifications: notifications || []
      }
    });
    ctx.body = {
      success: true,
      data: {
        settings: settings || {},
        notifications: notifications || []
      }
    };
  } catch (e) {
    console.error('getNotifications error:', e);
    ctx.status = 500;
    ctx.body = { success: false, error: e.message };
  }
}
