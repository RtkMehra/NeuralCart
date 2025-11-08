import { Router, type Router as RouterType } from 'express';
import { metricsRouter } from './metrics';
import { productRouter } from '../modules/products/product.router';
import { userRouter } from '../modules/users/user.router';
import { orderRouter } from '../modules/orders/order.router';
import { requestMetrics } from '../middleware/request-metrics';
import { asyncHandler } from '../utils/async-handler';
import { getHealthReport } from '../services/health.service';
import { searchRouter } from '../modules/search/search.router';
import { recommendationRouter } from '../modules/recommendations/recommendation.router';

const router: RouterType = Router();

router.get(
  '/health',
  requestMetrics('health'),
  asyncHandler(async (_req, res) => {
    const report = await getHealthReport();
    res.status(report.status === 'ok' ? 200 : report.status === 'degraded' ? 503 : 500).json(report);
  })
);

router.use('/metrics', metricsRouter);
router.use('/products', requestMetrics('products'), productRouter);
router.use('/users', requestMetrics('users'), userRouter);
router.use('/orders', requestMetrics('orders'), orderRouter);
router.use('/search', requestMetrics('search'), searchRouter);
router.use('/recommendations', requestMetrics('recommendations'), recommendationRouter);

export const apiRouter: RouterType = router;

