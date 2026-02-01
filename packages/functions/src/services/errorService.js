import { getCurrentShopData } from '@functions/helpers/auth';

/**
 * @param {*} err
 * @param {*} ctx
 * @return {Promise<void>}
 */
export function handleError(err, ctx) {
  const shopData = getCurrentShopData(ctx);
  if (shopData) {
    console.error('handle error ===', shopData.id, '===', shopData.shopifyDomain, '===', err);
  } else {
    console.error('Unauthenticated Error:', err);
  }
}
