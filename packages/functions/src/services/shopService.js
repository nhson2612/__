import * as shopRepository from '@functions/repositories/shopRepository';
import * as shopInfoRepository from '@functions/repositories/shopInfoRepository';

/**
 * Get shop by ID
 * @param {string} id - Shop ID
 * @returns {Promise<Object|null>}
 */
export async function getShopById(id) {
  return shopRepository.getShopById(id);
}

/**
 * Get shop by Shopify domain
 * @param {string} shopifyDomain - Shopify domain (e.g., 'my-shop.myshopify.com')
 * @returns {Promise<Object|null>}
 */
export async function getShopByShopifyDomain(shopifyDomain) {
  return shopRepository.getShopByShopifyDomain(shopifyDomain);
}

/**
 * Get shop info by shop ID
 * @param {string} shopId - Shop ID
 * @returns {Promise<Object|null>}
 */
export async function getShopInfoByShopId(shopId) {
  return shopInfoRepository.getShopInfoByShopId(shopId);
}
