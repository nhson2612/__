// eslint-disable-next-line valid-jsdoc
/**
 * @param {Shop} shop
 * @param {ShopInfo} shopInfo
 * @return {*&{shopifyPhone: (string|string), createdAt: *, shopifyPlan: *, shopifyCountry: string, timezone: *, shopAddress: string}}
 */
export function collectActiveShopData({shop, shopInfo}) {
  return {
    ...shop,
    shopifyPlan: shopInfo?.planName,
    shopifyCountry: shopInfo?.country,
    shopAddress: `${shopInfo?.address1 || ''}, ${shopInfo?.country}`,
    shopifyPhone: shopInfo?.phone || '',
    timezone: shopInfo?.ianaTimezone,
    createdAt: shopInfo?.createdAt
  };
}

/**
 * @param {*} _shop
 * @return {boolean}
 */
export function isShopUpgradable(_shop) {
  return false;
}
