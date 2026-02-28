/**
 * Daily scheduled task handler
 * Runs every day at midnight UTC (0 0 * * *)
 *
 * Usage:
 *   Add your daily tasks in the handler below.
 *   All tasks run in parallel for efficiency.
 *
 * Examples:
 *   - Clean up expired data
 *   - Send daily reports
 *   - Sync data with external services
 *   - Reset daily counters
 *
 * @param event - Scheduled event
 * @returns {Promise<void>}
 */
import {rebuildProductAffinity} from '@functions/services/productAffinityService';
import {getShopByShopifyDomain} from '@functions/services/shopService';

const DEFAULT_SHOP_DOMAIN = process.env.SHOPIFY_DOMAIN || '';

export default async function dailyCron(event) {
  console.log('Daily cron started at:', new Date().toISOString());

  try {
    await Promise.all([rebuildAffinityForDefaultShop()]);

    console.log('Daily cron completed successfully');
  } catch (e) {
    console.error('Daily cron error:', e);
    throw e;
  }
}

async function rebuildAffinityForDefaultShop() {
  if (!DEFAULT_SHOP_DOMAIN) {
    console.warn('SHOPIFY_DOMAIN not set, skip product affinity rebuild');
    return;
  }

  const shop = await getShopByShopifyDomain(DEFAULT_SHOP_DOMAIN);
  if (!shop) {
    console.warn('Shop not found for SHOPIFY_DOMAIN, skip product affinity rebuild');
    return;
  }

  const result = await rebuildProductAffinity(DEFAULT_SHOP_DOMAIN, {
    days: 60,
    first: 100,
    firstLineItems: 50,
    maxPages: 20,
    scoreMode: 'normalized'
  });

  console.log('Product affinity rebuild result:', result);
}
