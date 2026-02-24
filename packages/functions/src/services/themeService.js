import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {getShopById} from '@functions/services/shopService';

/**
 * Check if shop has avada-embed theme extension enabled
 * @param {string} shopId
 * @returns {Promise<boolean>}
 */
export default async function getThemeStatus(shopId) {
  const shop = await getShopById(shopId);
  const shopify = await initShopify(shop);
  const themeQuery = loadGraphQL('mainThemeSettings.graphql');

  const {themes} = await shopify.graphql(themeQuery, {}).catch(err => {
    console.error('GraphQL Error:', err);
    throw err;
  });
  const mainTheme = themes?.edges?.[0]?.node;

  if (!mainTheme) return false;

  const settingsData = mainTheme.files?.edges?.[0]?.node?.body?.content;
  if (!settingsData) return false;

  try {
    const jsonString = settingsData.replace(/^\/\*[\s\S]*?\*\//, '').trim();
    const settings = JSON.parse(jsonString);
    const blocks = settings.current?.blocks || {};

    return Object.values(blocks).some(
      block => block.type?.includes('avada-embed') && !block.disabled
    );
  } catch (e) {
    console.error('Error parsing settings_data.json:', e);
    return false;
  }
}
