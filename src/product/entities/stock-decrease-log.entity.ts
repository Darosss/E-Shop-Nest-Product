import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class StockDecreaseLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer', nullable: true })
  orderId: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'varchar' })
  reason: string;

  @ManyToOne(() => Product, (product) => product.stockDecreaseLogs)
  public product: Product;

  @Column({ type: 'integer', nullable: true })
  previousStockQuantity: number;

  @Column({ type: 'integer', nullable: true })
  currentStockQuantity: number;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
