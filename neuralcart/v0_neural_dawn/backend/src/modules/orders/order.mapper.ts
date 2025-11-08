import { Order } from '../../entities/Order';
import { mapProductToResponse } from '../products/product.mapper';
import { mapUserToResponse } from '../users/user.mapper';

export type OrderItemResponse = {
  id: string;
  quantity: number;
  unitPrice: number;
  product: ReturnType<typeof mapProductToResponse>;
  createdAt: string;
  updatedAt: string;
};

export type OrderResponse = {
  id: string;
  status: string;
  totalAmount: number;
  user: ReturnType<typeof mapUserToResponse>;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
};

export const mapOrderToResponse = (order: Order): OrderResponse => ({
  id: order.id,
  status: order.status,
  totalAmount: order.totalAmount,
  user: mapUserToResponse(order.user),
  items: order.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    product: mapProductToResponse(item.product),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  })),
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString()
});

