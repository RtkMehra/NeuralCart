import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Category } from './Category';
import { OrderItem } from './OrderItem';
import { moneyTransformer } from './transformers/money.transformer';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl!: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: moneyTransformer
  })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Index()
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category!: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'embedding_json', type: 'jsonb', nullable: true })
  embeddingJson!: number[] | null;
}

