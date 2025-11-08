import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';
import { moneyTransformer } from './transformers/money.transformer';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: moneyTransformer
  })
  unitPrice!: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE'
  })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    eager: true
  })
  product!: Product;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

