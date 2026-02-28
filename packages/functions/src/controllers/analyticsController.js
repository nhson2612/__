import * as eventService from '../services/eventService';
import * as shopService from '../services/shopService';
import {getCurrentShop} from '../helpers/auth';
import {handleError} from '../helpers/errorHandler';
import {initShopify} from '../services/shopifyService';
import {loadGraphQL} from '../helpers/graphql/graphqlHelpers';

/**
 * Get notification analytics for the shop
 * @param {Context} ctx
 */
export async function getStats(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shop = await shopService.getShopById(shopId);
    const stats = await eventService.getStats(shop.shopifyDomain);

    ctx.body = {
      success: true,
      data: stats
    };
  } catch (e) {
    console.error('Error getting analytics stats:', e);
    handleError(ctx, e);
  }
}

/**
 * Get hesitation report
 * @param {Context} ctx
 */
export async function getHesitationReport(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shop = await shopService.getShopById(shopId);
    const report = await eventService.getHesitantProducts(shop.shopifyDomain);

    const productIds = [...new Set(report.map(item => item.productId).filter(Boolean))];
    let productMap = {};
    if (productIds.length) {
      const shopify = initShopify(shop);
      const productQuery = loadGraphQL('/productsByIds.graphql');
      const {nodes} = await shopify.graphql(productQuery, {ids: productIds});
      productMap = (nodes || []).reduce((acc, node) => {
        if (node?.id) {
          acc[node.id] = {
            id: node.id,
            title: node.title,
            handle: node.handle,
            imageUrl: node.featuredImage?.url || '',
            imageAlt: node.featuredImage?.altText || node.title || ''
          };
        }
        return acc;
      }, {});
    }

    const enrichedReport = report.map(item => ({
      ...item,
      product: productMap[item.productId] || null
    }));

    ctx.body = {
      success: true,
      data: enrichedReport
    };
  } catch (e) {
    console.error('Error getting hesitation report:', e);
    handleError(ctx, e);
  }
}
