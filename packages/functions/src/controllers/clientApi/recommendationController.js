import {getShopByShopifyDomain} from '@functions/services/shopService';
import * as productAffinityRepository from '@functions/repositories/productAffinityRepository';

export async function getRecommendations(ctx) {
  try {
    const {shopifyDomain, productId, limit} = ctx.query;

    if (!shopifyDomain) {
      ctx.status = 400;
      ctx.body = {success: false, error: 'Missing shopifyDomain'};
      return;
    }

    if (!productId) {
      ctx.status = 400;
      ctx.body = {success: false, error: 'Missing productId'};
      return;
    }

    const shop = await getShopByShopifyDomain(shopifyDomain);
    if (!shop) {
      ctx.status = 404;
      ctx.body = {success: false, error: 'Shop not found'};
      return;
    }

    const results = await productAffinityRepository.getTopRelatedProducts(
      shopifyDomain,
      productId,
      Number(limit) || 5
    );

    ctx.body = {
      success: true,
      data: results
    };
  } catch (e) {
    console.error('getRecommendations error:', e);
    ctx.status = 500;
    ctx.body = {success: false, error: e.message};
  }
}
