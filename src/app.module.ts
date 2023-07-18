import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { databaseConfig } from './configs/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), ProductModule],
})
export class AppModule {}
