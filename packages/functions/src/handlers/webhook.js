import App from 'koa';
import bodyParser from 'koa-bodyparser';
import * as errorService from '../services/errorService';
import router from '../routes/webhook';

// Initialize all demand configuration for an application
const api = new App();
api.proxy = true;

const parseBody = bodyParser();
api.use(async (ctx, next) => {
  // Firebase functions framework may already consume the request stream.
  if (ctx.req.body !== undefined && ctx.request.body === undefined) {
    ctx.request.body = ctx.req.body;
    return next();
  }
  if (ctx.req.rawBody !== undefined) {
    return next();
  }
  if (ctx.req.readable === false) {
    return next();
  }
  return parseBody(ctx, next);
});

// Register all routes for the application
api.use(router.allowedMethods());
api.use(router.routes());

// Handling all errors
api.on('error', errorService.handleError);

export default api;
