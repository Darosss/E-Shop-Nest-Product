import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { StockDecreaseLog } from './entities/stock-decrease-log.entity';
import { CATEGORY_PACKAGE_NAME, CATEGORY_SERVICE_NAME } from './pb/category.pb';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CATEGORY_MICROSERVICE_URL } from 'src/configs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CATEGORY_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: CATEGORY_MICROSERVICE_URL,
          package: CATEGORY_PACKAGE_NAME,
          protoPath: 'node_modules/e-shop-nest-proto/proto/category.proto',
        },
      },
    ]),
    TypeOrmModule.forFeature([Product, StockDecreaseLog]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
