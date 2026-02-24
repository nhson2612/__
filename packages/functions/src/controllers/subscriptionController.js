import {getCurrentShop} from '@functions/helpers/auth';
import {getShopById} from '@functions/services/shopService';
import {
  addSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription
} from '@functions/repositories/subscriptionsRepository';
import {handleError} from '@functions/helpers/errorHandler';

/**
 * Get current subscription of a shop
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function getSubscription(ctx) {
  try {
    const shop = await getShopById(getCurrentShop(ctx));
    ctx.body = {shop};
  } catch (e) {
    handleError(ctx, e);
  }
}

/**
 * Get list of subscriptions
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function getList(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const query = ctx.query;
    ctx.body = await getSubscriptions(shopId, query);
  } catch (e) {
    handleError(ctx, e);
  }
}

/**
 * Create a new subscription
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function createOne(ctx) {
  try {
    const data = ctx.req.body;
    const shopId = getCurrentShop(ctx);
    await addSubscription(shopId, data);
    ctx.body = {success: true};
  } catch (e) {
    handleError(ctx, e);
  }
}

/**
 * Update an existing subscription
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function updateOne(ctx) {
  try {
    const {id, ...data} = ctx.req.body;
    await updateSubscription(id, data);
    ctx.body = {success: true};
  } catch (e) {
    handleError(ctx, e);
  }
}

/**
 * Delete a subscription
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function deleteOne(ctx) {
  try {
    const {id} = ctx.params;
    await deleteSubscription(id);
    ctx.body = {success: true};
  } catch (e) {
    handleError(ctx, e);
  }
}
