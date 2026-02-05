import * as shopRepository from '@functions/repositories/shopRepository';
import * as shopInfoRepository from '@functions/repositories/shopInfoRepository';

export async function getShopById(id) {
  return shopRepository.getShopById(id);
}

export async function getShopByShopifyDomain(shopifyDomain) {
  return shopRepository.getShopByShopifyDomain(shopifyDomain);
}

export async function getShopInfoByShopId(shopId) {
  return shopInfoRepository.getShopInfoByShopId(shopId);
}
