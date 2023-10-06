import { Product } from 'src/product/entities/product.entity';
import { Property } from 'src/property/entities/property.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductProperty extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'text', nullable: false })
  public value!: string;

  @ManyToOne(() => Product, (product) => product.properties)
  public product!: Product;

  @ManyToOne(() => Property, (property) => property.productProperties)
  public property!: Property;
}
