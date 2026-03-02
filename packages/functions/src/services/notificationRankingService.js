import * as eventService from '@functions/services/eventService';
import * as productAffinityRepository from '@functions/repositories/productAffinityRepository';
import {getOrdersByQuery} from '@functions/services/orderService';

const DEFAULT_STATS = {
  view: 0,
  click: 0,
  conversion: 0,
  revenue: 0,
  ctr: 0,
  conversionRate: 0
};

function getTimestampMs(timestamp) {
  if (!timestamp) return 0;
  if (typeof timestamp?.toDate === 'function') return timestamp.toDate().getTime();
  if (timestamp instanceof Date) return timestamp.getTime();
  const time = new Date(timestamp).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getConversionRate(stats = {}) {
  if (typeof stats.conversionRate === 'number') return stats.conversionRate;
  const view = Number(stats.view || 0);
  const conversion = Number(stats.conversion || 0);
  return view > 0 ? (conversion / view) * 100 : 0;
}

function withStats(notifications = [], statsMap = {}) {
  return notifications.map(notification => {
    const stats = statsMap[notification.id] || DEFAULT_STATS;
    return {
      ...notification,
      stats: {
        ...DEFAULT_STATS,
        ...stats
      }
    };
  });
}

function rankByClick(items = []) {
  return [...items].sort((a, b) => {
    const clickDiff = Number(b.stats?.click || 0) - Number(a.stats?.click || 0);
    if (clickDiff !== 0) return clickDiff;

    const viewDiff = Number(b.stats?.view || 0) - Number(a.stats?.view || 0);
    if (viewDiff !== 0) return viewDiff;

    return getTimestampMs(b.timestamp) - getTimestampMs(a.timestamp);
  });
}

function rankByConversionRate(items = []) {
  return [...items].sort((a, b) => {
    const conversionRateDiff = getConversionRate(b.stats) - getConversionRate(a.stats);
    if (conversionRateDiff !== 0) return conversionRateDiff;

    const conversionDiff = Number(b.stats?.conversion || 0) - Number(a.stats?.conversion || 0);
    if (conversionDiff !== 0) return conversionDiff;

    const clickDiff = Number(b.stats?.click || 0) - Number(a.stats?.click || 0);
    if (clickDiff !== 0) return clickDiff;

    return getTimestampMs(b.timestamp) - getTimestampMs(a.timestamp);
  });
}

function buildPersonalizedFallback(items = []) {
  return [...items].sort((a, b) => {
    const clickDiff = Number(b.stats?.click || 0) - Number(a.stats?.click || 0);
    if (clickDiff !== 0) return clickDiff;

    const conversionRateDiff = getConversionRate(b.stats) - getConversionRate(a.stats);
    if (conversionRateDiff !== 0) return conversionRateDiff;

    return getTimestampMs(b.timestamp) - getTimestampMs(a.timestamp);
  });
}

function normalizeCustomerId(customerId) {
  const value = String(customerId || '').trim();
  if (!value) return '';

  if (value.includes('gid://shopify/Customer/')) {
    return value.split('/').pop() || '';
  }

  return value;
}

async function getCustomerPurchasedProducts(shop, customerId, options = {}) {
  const normalizedCustomerId = normalizeCustomerId(customerId);
  if (!normalizedCustomerId) return [];

  const {days = 180, first = 50, firstLineItems = 30, maxPages = 5} = options;
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const query = `created_at:>=${sinceDate} customer_id:${normalizedCustomerId}`;

  const purchasedProductIds = new Set();
  let after = null;
  let page = 0;

  while (page < maxPages) {
    const response = await getOrdersByQuery(shop, {
      query,
      first,
      after,
      firstLineItems
    });
    const orders = response?.orders;
    const edges = orders?.edges || [];
    if (!edges.length) break;

    edges.forEach(edge => {
      const lineItems = edge?.node?.lineItems?.nodes || [];
      lineItems.forEach(item => {
        const productId = item?.product?.id;
        if (productId) purchasedProductIds.add(productId);
      });
    });

    if (!orders?.pageInfo?.hasNextPage) break;
    after = orders.pageInfo.endCursor;
    page++;
  }

  return Array.from(purchasedProductIds);
}

async function getPersonalizedScoreMap(shop, shopifyDomain, customerId) {
  const purchasedProducts = await getCustomerPurchasedProducts(shop, customerId);
  if (!purchasedProducts.length) return null;

  const topPurchasedProducts = purchasedProducts.slice(0, 20);
  const affinityResults = await Promise.all(
    topPurchasedProducts.map(productId =>
      productAffinityRepository.getTopRelatedProducts(shopifyDomain, productId, 20)
    )
  );

  const scoreMap = {};
  affinityResults.flat().forEach(item => {
    const relatedProductId = item?.relatedProductId;
    if (!relatedProductId) return;
    const score = Number(item?.score || item?.ordersCount || 0);
    if (!score) return;
    scoreMap[relatedProductId] = (scoreMap[relatedProductId] || 0) + score;
  });

  if (!Object.keys(scoreMap).length) return null;
  return scoreMap;
}

async function rankPersonalized(items, {shop, shopifyDomain, customerId}) {
  if (!customerId || !shop) return null;

  const scoreMap = await getPersonalizedScoreMap(shop, shopifyDomain, customerId);
  if (!scoreMap) return null;

  return [...items].sort((a, b) => {
    const personalScoreDiff =
      Number(scoreMap[b.productId] || 0) - Number(scoreMap[a.productId] || 0);
    if (personalScoreDiff !== 0) return personalScoreDiff;

    const clickDiff = Number(b.stats?.click || 0) - Number(a.stats?.click || 0);
    if (clickDiff !== 0) return clickDiff;

    const conversionRateDiff = getConversionRate(b.stats) - getConversionRate(a.stats);
    if (conversionRateDiff !== 0) return conversionRateDiff;

    return getTimestampMs(b.timestamp) - getTimestampMs(a.timestamp);
  });
}

/**
 * Rank notifications by configured strategy.
 * @param {object} options
 * @param {Array<object>} options.notifications
 * @param {string} options.shopifyDomain
 * @param {string} options.strategy
 * @param {object} options.shop
 * @param {string} [options.customerId]
 * @returns {Promise<Array<object>>}
 */
export async function rankNotificationsByStrategy({
  notifications = [],
  shopifyDomain,
  strategy = 'click_based',
  shop,
  customerId
}) {
  if (!notifications.length) return [];

  let stats = {};
  try {
    stats = await eventService.getStatsPerNotification(shopifyDomain);
  } catch (error) {
    console.error('Failed to load notification stats for ranking:', error);
  }

  const items = withStats(notifications, stats);

  if (strategy === 'conversion_rate') {
    return rankByConversionRate(items);
  }

  if (strategy === 'personalized_apriori') {
    try {
      const ranked = await rankPersonalized(items, {shop, shopifyDomain, customerId});
      if (ranked) return ranked;
    } catch (error) {
      console.error('Personalized ranking failed. Fallback to non-personalized ranking:', error);
    }
    return buildPersonalizedFallback(items);
  }

  return rankByClick(items);
}

