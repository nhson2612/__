import getThemeStatus from '@functions/services/themeService';
import {getCurrentShop} from '../helpers/auth';

export default async function getThemeStatusController(ctx) {
  const shopDomain = getCurrentShop(ctx);
  const isEnabled = await getThemeStatus(shopDomain);
  ctx.body = {
    success: true,
    data: {
      themeStatus: isEnabled
    }
  };
}
