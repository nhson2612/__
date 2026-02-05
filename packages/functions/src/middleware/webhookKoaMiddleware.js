import crypto from 'crypto';

const APP_SECRET = '7ee83a63ff342270e6187f7f32faac82fd0948160c200811472617fd4891da81';

export default async function verifyWebhook(ctx, next) {
  console.log('>>>>>>>>>>>>>>> VERIFYING WEBHOOK <<<<<<<<<<<<<<<<');
  console.log('>>>>>>>>>>>>>>> CTX HEADERS: ', ctx.headers, ' <<<<<<<<<<<<<<<<');
  const rawBody = ctx.req.rawBody;
  const hmac = getHmac(ctx);

  const hmac2 = crypto
    .createHmac('sha256', APP_SECRET)
    .update(rawBody)
    .digest('base64');

  if (hmac !== hmac2) {
    console.error('>>>>>>>>>>>>>>> Cannot verify webhook');
    ctx.body = {
      success: false,
      message: 'Cannot verify webhook'
    };
    return;
  }

  return next();
}

function getHmac(ctx) {
  return ctx.get('X-Shopify-Hmac-Sha256');
}
