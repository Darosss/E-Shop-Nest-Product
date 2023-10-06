import { Module, forwardRef } from '@nestjs/common';
import { ProductPropertyService } from './product-property.service';
import { ProductPropertyController } from './product-property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductProperty } from './entities/product-property.entity';
import { ProductModule } from 'src/product/product.module';
import { PropertyModule } from 'src/property/property.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductProperty]),
    ProductModule,
    forwardRef(() => PropertyModule),
  ],
  controllers: [ProductPropertyController],
  providers: [ProductPropertyService],
  exports: [ProductPropertyService],
})
export class ProductPropertyModule {}
