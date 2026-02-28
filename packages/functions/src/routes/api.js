import Router from 'koa-router';
import * as notificationController from '@functions/controllers/notificationController';
import * as settingController from '@functions/controllers/settingController';
import * as themeController from '@functions/controllers/themeController';
import * as shopController from '@functions/controllers/shopController';
import * as analyticsController from '@functions/controllers/analyticsController';
import settingInputMiddleware from '@functions/middleware/settingInputMiddleware';
import {getApiPrefix} from '@functions/const/app';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/notifications', notificationController.getList);
  router.delete('/notifications/:id', notificationController.deleteNotification);
  router.get('/settings', settingController.getSettings);
  router.put('/settings', settingInputMiddleware, settingController.updateSettings);
  router.get('/shops', shopController.getUserShops);
  router.get('/theme/status', themeController.default);
  router.get('/analytics/stats', analyticsController.getStats);
  router.get('/analytics/hesitation-report', analyticsController.getHesitationReport);
  return router;
}
