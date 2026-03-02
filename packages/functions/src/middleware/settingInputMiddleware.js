import * as yup from 'yup';

const settingsSchema = yup.object().shape({
  display: yup
    .object()
    .shape({
      position: yup.string().oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
      hideTimeAgo: yup.boolean(),
      truncateContent: yup.boolean(),
      displayStrategy: yup
        .string()
        .oneOf(['click_based', 'conversion_rate', 'personalized_apriori']),
      displayDuration: yup.number().min(0),
      firstPopDelay: yup.number().min(0),
      gapTime: yup.number().min(0),
      maxPopups: yup.number().min(0)
    })
    .required(),
  triggers: yup
    .object()
    .shape({
      pageRestriction: yup.string().oneOf(['all', 'specific']),
      specificPages: yup.array().of(yup.string()),
      excludedPages: yup.array().of(yup.string())
    })
    .required()
});

/**
 * @param {Context} ctx
 * @param {Function} next
 * @returns {Promise<*>}
 */
export default async function settingInputMiddleware(ctx, next) {
  try {
    ctx.req.body = await settingsSchema.validate(ctx.req.body);
    return next();
  } catch (e) {
    ctx.status = 400;
    const error = e.errors ? e.errors[0] : e.message;
    ctx.body = {
      success: false,
      error
    };
  }
}
