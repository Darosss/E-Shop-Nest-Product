import { Test, TestingModule } from '@nestjs/testing';
import { ProductPropertyController } from './product-property.controller';
import { ProductPropertyService } from './product-property.service';

describe('ProductsPropertiesController', () => {
  let controller: ProductPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPropertyController],
      providers: [ProductPropertyService],
    }).compile();

    controller = module.get<ProductPropertyController>(
      ProductPropertyController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
