import {getOrdersByDateRange} from './orderService';
import {getShopByShopifyDomain} from './shopService';
import * as productAffinityRepository from '@functions/repositories/productAffinityRepository';

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function addPairCount(pairCounts, productId, relatedProductId) {
  if (!pairCounts[productId]) pairCounts[productId] = {};
  pairCounts[productId][relatedProductId] = (pairCounts[productId][relatedProductId] || 0) + 1;
}

function addTotalCount(totalCounts, productId) {
  totalCounts[productId] = (totalCounts[productId] || 0) + 1;
}

/**
 * Build co-purchase stats for a shop and upsert into product_affinity
 * @param {string} shopifyDomain
 * @param {object} options
 * @param {number} [options.days=30]
 * @param {number} [options.first=100]
 * @param {number} [options.firstLineItems=50]
 * @param {number} [options.maxPages=20]
 * @param {'raw'|'normalized'} [options.scoreMode='raw']
 * @returns {Promise<{ordersProcessed:number, pairs:number, upserted:number}>}
 */
export async function rebuildProductAffinity(shopifyDomain, options = {}) {
  const {days = 30, first = 100, firstLineItems = 50, maxPages = 20, scoreMode = 'raw'} = options;

  const shop = await getShopByShopifyDomain(shopifyDomain);
  if (!shop) throw new Error('Shop not found');

  const pairCounts = {};
  const totalCounts = {};
  let ordersProcessed = 0;
  let page = 0;
  let after = null;

  while (page < maxPages) {
    const resp = await getOrdersByDateRange(shop, {
      days,
      first,
      after,
      firstLineItems
    });

    const orders = resp?.orders;
    const edges = orders?.edges || [];

    if (!edges.length) break;

    edges.forEach(edge => {
      const order = edge?.node;
      const lineItems = order?.lineItems?.nodes || [];
      const productIds = unique(lineItems.map(item => item?.product?.id));

      if (productIds.length < 2) return;

      productIds.forEach(pid => addTotalCount(totalCounts, pid));

      for (let i = 0; i < productIds.length; i++) {
        for (let j = 0; j < productIds.length; j++) {
          if (i === j) continue;
          addPairCount(pairCounts, productIds[i], productIds[j]);
        }
      }

      ordersProcessed++;
    });

    const pageInfo = orders?.pageInfo;
    if (!pageInfo?.hasNextPage) break;

    after = pageInfo.endCursor;
    page++;
  }

  const items = [];
  let pairs = 0;

  Object.keys(pairCounts).forEach(productId => {
    const relatedMap = pairCounts[productId];
    const totalOrdersWithProduct = totalCounts[productId] || 1;

    Object.keys(relatedMap).forEach(relatedProductId => {
      const ordersCount = relatedMap[relatedProductId];
      const score = scoreMode === 'normalized' ? ordersCount / totalOrdersWithProduct : ordersCount;

      items.push({
        shopId: shopifyDomain,
        productId,
        relatedProductId,
        ordersCount,
        score
      });
      pairs++;
    });
  });

  const upserted = await productAffinityRepository.bulkUpsert(items);

  return {ordersProcessed, pairs, upserted};
}
