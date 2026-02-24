import {getAppNewsList} from '@functions/repositories/appNewsRepository';
import {handleError} from '@functions/helpers/errorHandler';

/**
 * Get list of app news
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function getList(ctx) {
  try {
    const {hasNext, hasPre, ...resp} = await getAppNewsList(ctx.query);
    ctx.body = {...resp, pageInfo: {hasNext, hasPre}};
  } catch (e) {
    handleError(ctx, e);
  }
}
