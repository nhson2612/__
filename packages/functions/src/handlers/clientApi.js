import App from 'koa';
import bodyParser from 'koa-bodyparser';
import * as errorService from '../services/errorService';
import router from '../routes/clientApi';
import cors from 'koa2-cors';

// Initialize all demand configuration for an application
const clientApi = new App();
clientApi.proxy = true;

clientApi.use(cors());

const parseBody = bodyParser();
clientApi.use(async (ctx, next) => {
  if (ctx.req.body !== undefined && ctx.request.body === undefined) {
    ctx.request.body = ctx.req.body;
    return next();
  }
  if (ctx.req.rawBody !== undefined || ctx.req.readable === false || ctx.req.complete === true) {
    return next();
  }

  return parseBody(ctx, next);
});

// Register all routes for the application
clientApi.use(router.allowedMethods());
clientApi.use(router.routes());

// Handling all errors
clientApi.on('error', errorService.handleError);

export default clientApi;
