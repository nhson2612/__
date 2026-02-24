import * as settingService from '../services/settingService';
import {getCurrentShop} from '../helpers/auth';
import {handleError} from '../helpers/errorHandler';

/**
 * Get settings for current shop
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function getSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const settings = await settingService.getSettings(shopId);
    ctx.body = {
      data: settings
    };
  } catch (e) {
    handleError(ctx, e);
  }
}

/**
 * Update settings for current shop
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function updateSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    if (!shopId) {
      ctx.status = 401;
      ctx.body = {success: false, error: 'Unauthorized'};
      return;
    }
    await settingService.updateSettings(shopId, ctx.req.body);
    ctx.body = {
      success: true,
      message: 'Settings saved successfully'
    };
  } catch (e) {
    handleError(ctx, e);
  }
}
