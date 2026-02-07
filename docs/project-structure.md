# Project Structure

## Repository Type: Monorepo

## Parts: 4

| Part ID   | Part Name               | Part Type | Root Path                                                                                                                 | Technology                                       |
| --------- | ----------------------- | --------- |---------------------------------------------------------------------------------------------------------------------------| ------------------------------------------------ |
| assets    | Frontend Assets         | Web       | /home/nhson2612/Desktop/Personal_Projects/my-shopify-app/test-app-2/app-name/packages/packages/assets                     | React 18, Vite 6, Shopify App Bridge, Polaris    |
| functions | Backend Functions       | Backend   | /home/nhson2612/Desktop/Personal_Projects/my-shopify-app/test-app-2/app-name/packages/functions                           | Node.js 20, Firebase Functions, Koa, Shopify API |
| scripttag | Script Tag Component    | Web       | /home/nhson2612/Desktop/Personal_Projects/my-shopify-app/test-app-2/app-name/packages/scripttag                           | Preact, Rspack                                   |
| extension | Shopify Theme Extension | Extension | /home/nhson2612/Desktop/Personal_Projects/my-shopify-app/test-app-2/app-name/extensions/avada-theme-app-extension         | Shopify App Extension, Liquid                    |

## Integration Points

- **assets → functions**: HTTP API calls via axios
- **assets → extension**: Shopify embedded app integration
- **scripttag → shopify stores**: Script tag injection
- **functions → Shopify API**: Direct Shopify API integration via shopify-api-node
