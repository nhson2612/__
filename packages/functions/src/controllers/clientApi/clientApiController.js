import {getShopByShopifyDomain} from '../../repositories/shopRepository';
import {getSettings} from '../../repositories/settingRepository';
import {getList} from '../../repositories/notificationRepository';

/**
 * Health check endpoint
 * @param ctx
 */
export async function health(ctx) {
  ctx.body = {
    success: true,
    message: 'Client API is healthy'
  };
}

/**
 * Get notifications and settings for storefront
 * @param ctx
 */
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

    const [settings, notificationsResult] = await Promise.all([
      getSettings(shop.id),
      getList(shop.id, {limit: 20, sort: 'timestamp', direction: 'desc'})
    ]);

    ctx.body = {
      success: true,
      data: {
        settings: settings || {},
        notifications: notificationsResult.data || []
      }
    };
  } catch (e) {
    console.error('getNotifications error:', e);
    ctx.status = 500;
    ctx.body = {success: false, error: e.message};
  }
}

// Add more client API handlers here
// Example:
// export async function getData(ctx) {
//   try {
//     const { shopifyDomain } = ctx.query;
//     // Fetch and return data for the storefront
//     return (ctx.body = {
//       data: [],
//       success: true
//     });
//   } catch (e) {
//     return (ctx.body = {
//       data: [],
//       error: e.message
//     });
//   }
// }
