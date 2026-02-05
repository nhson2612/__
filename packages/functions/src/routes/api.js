import Router from 'koa-router';
import * as notificationController from '@functions/controllers/notificationController';
import * as settingController from '@functions/controllers/settingController';
import settingInputMiddleware from '@functions/middleware/settingInputMiddleware';
import {getApiPrefix} from '@functions/const/app';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/notifications', notificationController.getList);
  router.get('/settings', settingController.getSettings);
  router.put('/settings', settingInputMiddleware, settingController.updateSettings);

  return router;
}
