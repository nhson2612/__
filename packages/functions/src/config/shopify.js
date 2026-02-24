import 'dotenv/config';

export default {
  secret: process.env.SHOPIFY_SECRET || '',
  apiKey: process.env.SHOPIFY_API_KEY || '',
  firebaseApiKey: process.env.SHOPIFY_FIREBASE_API_KEY || '',
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || [
    'read_themes',
    'write_themes',
    'read_orders',
    'read_products',
    'write_script_tags'
  ],
  accessTokenKey: process.env.SHOPIFY_ACCESS_TOKEN_KEY || 'avada-apps-access-token'
};
