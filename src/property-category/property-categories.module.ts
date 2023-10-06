import { Module } from '@nestjs/common';
import { PropertyCategoriesService } from './property-categories.service';
import { PropertyCategoriesController } from './property-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCategory } from './entities/property-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyCategory])],
  controllers: [PropertyCategoriesController],
  providers: [PropertyCategoriesService],
  exports: [PropertyCategoriesService],
})
export class PropertyCategoriesModule {}
