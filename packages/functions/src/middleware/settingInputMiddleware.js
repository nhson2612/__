import * as yup from 'yup';

const settingsSchema = yup.object().shape({
  display: yup.object().shape({
    position: yup.string().oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
    hideTimeAgo: yup.boolean(),
    truncateContent: yup.boolean(),
    displayDuration: yup.number().min(0),
    firstPopDelay: yup.number().min(0),
    gapTime: yup.number().min(0),
    maxPopups: yup.number().min(0)
  }).required(),
  triggers: yup.object().shape({
    pageRestriction: yup.string().oneOf(['all', 'specific']),
    specificPages: yup.array().of(yup.string()),
    excludedPages: yup.array().of(yup.string())
  }).required()
});

/**
 * @param {Context} ctx
 * @param {Function} next
 * @returns {Promise<*>}
 */
export default async function settingInputMiddleware(ctx, next) {
  try {
    console.log('settingInputMiddleware input:', JSON.stringify(ctx.request.body, null, 2));
    ctx.request.body = await settingsSchema.validate(ctx.request.body);
    console.log('Validation successful');
    return next();
  } catch (e) {
    console.error('Validation failed:', e.message);
    ctx.status = 400;
    const error = e.errors ? e.errors[0] : e.message;
    ctx.body = {
      success: false,
      error
    };
  }
}
