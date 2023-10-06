import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { databaseConfig } from './configs/database.config';
import { PropertyModule } from './property/property.module';
import { ProductPropertyModule } from './product-property/product-property.module';
import { PropertyCategoriesModule } from './property-category/property-categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProductModule,
    PropertyModule,
    ProductPropertyModule,
    PropertyCategoriesModule,
  ],
})
export class AppModule {}
