import * as notificationEventRepository from '../repositories/notificationEventRepository';
import {getShopByShopifyDomain} from './shopService';

/**
 * Record a notification event
 * @param {string} shopifyDomain
 * @param {string} notificationId
 * @param {string} type - 'view' | 'click' | 'conversion'
 * @param {object} metadata
 * @returns {Promise<string>}
 */
export async function recordEvent(shopifyDomain, notificationId, type, metadata = {}) {
  const shop = await getShopByShopifyDomain(shopifyDomain);
  if (!shop) {
    throw new Error('Shop not found');
  }
  if (type === 'conversion' && metadata.orderId) {
    const existing = await notificationEventRepository.getConversionByOrderId(metadata.orderId);
    if (existing) {
      console.log(`Conversion for order ${metadata.orderId} already recorded`);
      return existing.id;
    }
  }

  return notificationEventRepository.create({
    shopId: shopifyDomain,
    notificationId,
    type,
    ...metadata
  });
}

/**
 * Get stats for a shop
 * @param {string} shopifyDomain
 * @returns {Promise<object>}
 */
export async function getStats(shopifyDomain) {
  const stats = await notificationEventRepository.getStatsByShopId(shopifyDomain);

  const ctr = stats.view > 0 ? (stats.click / stats.view) * 100 : 0;
  const conversionRate = stats.view > 0 ? (stats.conversion / stats.view) * 100 : 0;

  return {
    ...stats,
    ctr: parseFloat(ctr.toFixed(2)),
    conversionRate: parseFloat(conversionRate.toFixed(2))
  };
}

/**
 * Get stats per notification for a shop (used by notification list)
 * @param {string} shopifyDomain
 * @returns {Promise<object>}
 */
export async function getStatsPerNotification(shopifyDomain) {
  const stats = await notificationEventRepository.getStatsPerNotification(shopifyDomain);

  for (const [, s] of Object.entries(stats)) {
    s.ctr = s.view > 0 ? parseFloat(((s.click / s.view) * 100).toFixed(2)) : 0;
    s.conversionRate = s.view > 0 ? parseFloat(((s.conversion / s.view) * 100).toFixed(2)) : 0;
  }

  return stats;
}

/**
 * Get stats per product for a shop
 * @param {string} shopifyDomain
 * @returns {Promise<object>}
 */
export async function getStatsPerProduct(shopifyDomain) {
  const stats = await notificationEventRepository.getStatsPerProduct(shopifyDomain);

  for (const [, s] of Object.entries(stats)) {
    s.conversionRate = s.click > 0 ? parseFloat(((s.conversion / s.click) * 100).toFixed(2)) : 0;
  }

  return stats;
}

/**
 * Get product performance report
 * @param {string} shopId
 * @returns {Promise<Array>}
 */
export async function getHesitantProducts(shopId) {
  const stats = await getStatsPerProduct(shopId);

  return Object.values(stats)
    .filter(s => s.click > 0)
    .sort((a, b) => b.click - a.click);
}
