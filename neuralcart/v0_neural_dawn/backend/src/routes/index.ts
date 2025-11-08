import { Router } from 'express';
import { orderRouter } from '../modules/orders/order.router';
import { productRouter } from '../modules/products/product.router';
import { userRouter } from '../modules/users/user.router';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);

export const apiRouter = router;

