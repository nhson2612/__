import Router from 'koa-router';
import * as clientApiController from '../controllers/clientApi/clientApiController';
import * as eventController from '../controllers/clientApi/eventController';
import * as recommendationController from '../controllers/clientApi/recommendationController';

const router = new Router({
  prefix: '/clientApi'
});

router.get('/notifications', clientApiController.getNotifications);
router.post('/events', eventController.track);
router.get('/recommendations', recommendationController.getRecommendations);

export default router;
