import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductProperty } from 'src/product-property/entities/product-property.entity';
import { PropertyCategory } from 'src/property-category/entities/property-category.entity';

@Entity()
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public name!: string;

  @ManyToOne(() => PropertyCategory, (category) => category.properties)
  category!: PropertyCategory;

  @OneToMany(
    () => ProductProperty,
    (productProperty) => productProperty.property,
  )
  productProperties: ProductProperty[];
}
