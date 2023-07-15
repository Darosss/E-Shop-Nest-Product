import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'eshopnestproduct',
      username: 'postgres',
      password: '123',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}
