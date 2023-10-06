import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCategoriesController } from './property-categories.controller';
import { PropertyCategoriesService } from './property-categories.service';

describe('PropertyCategoriesController', () => {
  let controller: PropertyCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyCategoriesController],
      providers: [PropertyCategoriesService],
    }).compile();

    controller = module.get<PropertyCategoriesController>(PropertyCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
