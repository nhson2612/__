import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {getShopByShopifyDomain} from '@functions/services/shopService';

export default async function getTheme(shopDomain) {
  const shop = await getShopByShopifyDomain(shopDomain);
  const shopify = await initShopify(shop);
  const themeQuery = loadGraphQL('/mainThemeSettings.graphql');
  console.log('>>>>>>>>>>>>>.. themeQuery', themeQuery);
  return shopify.graphql(themeQuery);
}
