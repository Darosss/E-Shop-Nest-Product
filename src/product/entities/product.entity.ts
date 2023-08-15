import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StockDecreaseLog } from './stock-decrease-log.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar', nullable: true })
  public description: string;

  @Column({ type: 'varchar' })
  public brand!: string;

  @Column({ type: 'integer' })
  public category!: number;

  @Column({ type: 'varchar' })
  public sku!: string;

  @Column({ type: 'integer' })
  public stock!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public price!: number;

  @OneToMany(
    () => StockDecreaseLog,
    (stockDecreaseLog) => stockDecreaseLog.product,
  )
  public stockDecreaseLogs: StockDecreaseLog[];

  @Column({ type: 'integer', default: 0 })
  public sold!: number;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
