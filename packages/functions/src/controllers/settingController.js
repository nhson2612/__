import * as settingService from '../services/settingService';
import { getCurrentShop } from '../helpers/auth';

/**
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function getSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    console.log('>>>>>>>>>> getSettings called for shopId:', shopId);
    const settings = await settingService.getSettings(shopId);
    console.log('>>>>>>>>>>>>>> Retrieved settings:', settings);
    ctx.body = {
      data: settings
    };
  } catch (e) {
    console.error('>>>>>>>>>>>>>> getSettings Error:', e);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
}

/**
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function updateSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    if (!shopId) {
      ctx.status = 401;
      ctx.body = { success: false, error: 'Unauthorized' };
      return;
    }
    console.log('updateSettings called for shopId:', shopId);
    console.log('Request body:', JSON.stringify(ctx.request.body, null, 2));

    await settingService.updateSettings(shopId, ctx.request.body);

    console.log('Setting saved successfully');
    ctx.body = {
      success: true,
      message: 'Settings saved successfully'
    };
  } catch (e) {
    console.error('updateSettings Error:', e);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
}
