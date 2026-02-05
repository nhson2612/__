import Router from 'koa-router';
import * as clientApiController from '../controllers/clientApi/clientApiController';

const router = new Router({
  prefix: '/clientApi'
});

router.get('/notifications', clientApiController.getNotifications);

export default router;
