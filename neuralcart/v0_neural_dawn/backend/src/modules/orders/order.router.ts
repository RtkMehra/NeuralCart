import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import {
  createOrderHandler,
  deleteOrderHandler,
  getOrderHandler,
  listOrdersHandler,
  updateOrderHandler
} from './order.controller';

export const orderRouter = Router();

orderRouter.get('/', asyncHandler(listOrdersHandler));
orderRouter.get('/:id', asyncHandler(getOrderHandler));
orderRouter.post('/', asyncHandler(createOrderHandler));
orderRouter.put('/:id', asyncHandler(updateOrderHandler));
orderRouter.delete('/:id', asyncHandler(deleteOrderHandler));

