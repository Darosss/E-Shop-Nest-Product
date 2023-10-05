import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { ProductPropertyModule } from 'src/product-property/product-property.module';
import { PropertyCategoriesModule } from 'src/property-categories/property-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
    ProductPropertyModule,
    PropertyCategoriesModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
