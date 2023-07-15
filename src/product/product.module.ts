import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { StockDecreaseLog } from './entities/stock-decrease-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, StockDecreaseLog])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
