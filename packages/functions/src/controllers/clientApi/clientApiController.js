import {getShopByShopifyDomain} from '@functions/services/shopService';
import {buildDefaultSettings, getSettings} from '../../services/settingService';
import {getLatestByShopId} from '../../repositories/notificationRepository';
import {rankNotificationsByStrategy} from '../../services/notificationRankingService';

export async function getNotifications(ctx) {
  try {
    const {shopifyDomain, customerId} = ctx.query;
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

    const maxPopups = settings?.display?.maxPopups || 30;
    const strategy = settings?.display?.displayStrategy || 'click_based';
    const candidateLimit = Math.max(maxPopups * 3, 50);

    const rawNotifications = await getLatestByShopId(shopifyDomain, candidateLimit);
    const rankedNotifications = await rankNotificationsByStrategy({
      notifications: rawNotifications,
      shopifyDomain,
      strategy,
      shop,
      customerId
    });

    ctx.body = {
      success: true,
      data: {
        settings: settings,
        notifications: (rankedNotifications || []).slice(0, maxPopups)
      }
    };
  } catch (e) {
    console.error('getNotifications error:', e);
    ctx.status = 500;
    ctx.body = {success: false, error: e.message};
  }
}
