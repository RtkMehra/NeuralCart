import { z } from 'zod';
import { OrderStatus } from '../../entities/Order';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export const listOrdersSchema = paginationSchema;

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive()
});

export const createOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required')
});

export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

