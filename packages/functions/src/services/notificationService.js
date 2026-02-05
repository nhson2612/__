import * as notificationRepository from '@functions/repositories/notificationRepository';
import * as shopService from '@functions/services/shopService';

/**
 * Get list of notifications for a specific shop
 * @param {string} shopId
 * @param {object} params
 * @returns {Promise<{data: *[], pageInfo: {hasNext: boolean, hasPrev: boolean, firstElement: string, lastElement: string}}>}
 */
const getList = async (shopId, params = {}) => {
  const {limit, sort, direction, nextCursor, prevCursor} = params;
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>> GET NOTIFICATIONS FOR SHOP: ', shopId);
  const shopDomain = (await shopService.getShopById(shopId)).shopifyDomain;

  return notificationRepository.getList(shopDomain, {
    limit,
    sort,
    direction,
    firstElement: nextCursor,
    lastElement: prevCursor
  });
};

export default {
  getList
};
