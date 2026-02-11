import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {getShopById} from '@functions/services/shopService';
import * as fs from 'node:fs';

export default async function getThemeStatus(shopId) {
  const shop = await getShopById(shopId);
  const shopify = await initShopify(shop);
  const themeQuery = loadGraphQL('mainThemeSettings.graphql');

  // Trying to pass query as string AND variables to see if it fixes Content-Type
  const {themes} = await shopify.graphql(themeQuery, {}).catch(err => {
    console.error('GraphQL Error Full:', JSON.stringify(err, null, 2));
    console.error('GraphQL Response Body:', err.response?.body);
    throw err;
  });
  const mainTheme = themes?.edges?.[0]?.node;

  if (!mainTheme) return false;

  const settingsData = mainTheme.files?.edges?.[0]?.node?.body?.content;
  if (!settingsData) return false;

  try {
    const jsonString = settingsData.replace(/^\/\*[\s\S]*?\*\//, '').trim();
    fs.writeFileSync('../../settingData.json', jsonString);
    const settings = JSON.parse(jsonString);
    const blocks = settings.current?.blocks || {};
    console.log(
      '>>>>>>>>>> Found Blocks:',
      JSON.stringify(Object.values(blocks).map(b => ({type: b.type, disabled: b.disabled})))
    );

    return Object.values(blocks).some(
      block => block.type?.includes('avada-embed') && !block.disabled
    );
  } catch (e) {
    console.error('Error parsing settings_data.json:', e);
    return false;
  }
}
