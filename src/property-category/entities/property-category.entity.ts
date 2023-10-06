import { Property } from 'src/property/entities/property.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PropertyCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public name!: string;

  @OneToMany(() => Property, (property) => property.category)
  properties: Property[];
}
