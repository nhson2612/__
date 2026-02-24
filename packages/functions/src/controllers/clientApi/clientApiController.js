import {getShopByShopifyDomain} from '@functions/services/shopService';
import {buildDefaultSettings, getSettings} from '../../services/settingService';
import {getLatestByShopId} from '../../repositories/notificationRepository';

export async function getNotifications(ctx) {
  try {
    const {shopifyDomain} = ctx.query;
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

    let settings = await getSettings(shop.id);
    if (!settings || Object.keys(settings).length === 0) {
      settings = buildDefaultSettings(shop.id);
    }
    const notifications = await getLatestByShopId(shopifyDomain, settings.display.maxPopups || 30);
    ctx.body = {
      success: true,
      data: {
        settings: settings,
        notifications: notifications || []
      }
    };
  } catch (e) {
    console.error('getNotifications error:', e);
    ctx.status = 500;
    ctx.body = {success: false, error: e.message};
  }
}
