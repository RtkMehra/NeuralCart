import { In } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Order, OrderStatus } from '../../entities/Order';
import { OrderItem } from '../../entities/OrderItem';
import { Product } from '../../entities/Product';
import { User } from '../../entities/User';
import { HttpError } from '../../utils/http-error';
import {
  CreateOrderInput,
  ListOrdersInput,
  UpdateOrderInput
} from './order.schema';

const orderRepository = () => AppDataSource.getRepository(Order);
const userRepository = () => AppDataSource.getRepository(User);
const productRepository = () => AppDataSource.getRepository(Product);

export const listOrders = async ({ page, limit }: ListOrdersInput) => {
  const repository = orderRepository();

  const [items, total] = await repository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
    relations: {
      user: true,
      items: {
        product: {
          category: true
        }
      }
    }
  });

  return { items, total, page, limit };
};

export const getOrderById = async (id: string) => {
  const order = await orderRepository().findOne({
    where: { id },
    relations: {
      user: true,
      items: {
        product: {
          category: true
        }
      }
    }
  });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  return order;
};

export const createOrder = async (input: CreateOrderInput) => {
  const createdOrder = await AppDataSource.manager.transaction(async (manager) => {
    const user = await manager.findOne(User, { where: { id: input.userId } });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const productIds = input.items.map((item) => item.productId);
    const products = await manager.find(Product, {
      where: { id: In(productIds) },
      relations: { category: true }
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missing = productIds.filter((id) => !foundIds.has(id));
      throw new HttpError(404, `Products not found: ${missing.join(', ')}`);
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const order = manager.create(Order, {
      status: OrderStatus.PENDING,
      user,
      totalAmount: 0,
      items: []
    });

    let totalAmount = 0;

    for (const itemInput of input.items) {
      const product = productMap.get(itemInput.productId)!;

      if (product.stock < itemInput.quantity) {
        throw new HttpError(
          400,
          `Insufficient stock for product ${product.name}`
        );
      }

      product.stock -= itemInput.quantity;
      await manager.save(product);

      const orderItem = manager.create(OrderItem, {
        quantity: itemInput.quantity,
        unitPrice: product.price,
        product,
        order
      });

      order.items.push(orderItem);
      totalAmount += product.price * itemInput.quantity;
    }

    order.totalAmount = Number(totalAmount.toFixed(2));

    return manager.save(order);
  });

  return getOrderById(createdOrder.id);
};

export const updateOrder = async (id: string, input: UpdateOrderInput) => {
  const repository = orderRepository();
  const order = await repository.findOne({ where: { id } });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  order.status = input.status;

  await repository.save(order);

  return getOrderById(id);
};

export const deleteOrder = async (id: string) => {
  const repository = orderRepository();
  const order = await repository.findOne({ where: { id } });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  await repository.remove(order);
};

