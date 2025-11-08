import { Request, Response } from 'express';
import { HttpError } from '../../utils/http-error';
import {
  createOrder,
  deleteOrder,
  getOrderById,
  listOrders,
  updateOrder
} from './order.service';
import {
  createOrderSchema,
  listOrdersSchema,
  updateOrderSchema
} from './order.schema';
import { mapOrderToResponse } from './order.mapper';

export const listOrdersHandler = async (req: Request, res: Response) => {
  const parseResult = listOrdersSchema.safeParse(req.query);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid query parameters', parseResult.error.flatten());
  }

  const result = await listOrders(parseResult.data);

  res.status(200).json({
    data: result.items.map(mapOrderToResponse),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit
    }
  });
};

export const getOrderHandler = async (req: Request, res: Response) => {
  const order = await getOrderById(req.params.id);
  res.status(200).json({ data: mapOrderToResponse(order) });
};

export const createOrderHandler = async (req: Request, res: Response) => {
  const parseResult = createOrderSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const order = await createOrder(parseResult.data);
  res.status(201).json({ data: mapOrderToResponse(order) });
};

export const updateOrderHandler = async (req: Request, res: Response) => {
  const parseResult = updateOrderSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const order = await updateOrder(req.params.id, parseResult.data);
  res.status(200).json({ data: mapOrderToResponse(order) });
};

export const deleteOrderHandler = async (req: Request, res: Response) => {
  await deleteOrder(req.params.id);
  res.status(204).send();
};

