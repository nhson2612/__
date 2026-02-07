import getTheme from '@functions/services/themeService';

export default async function getThemeStatus(ctx) {
  const shopDomain = ctx?.query?.shop;
  await getTheme(shopDomain);
  return (ctx.body = {
    success: true,
    data: {
      themeStatus: 'enable'
    }
  });
}
