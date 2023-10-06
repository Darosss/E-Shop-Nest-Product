import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCategoriesService } from './property-categories.service';

describe('PropertyCategoriesService', () => {
  let service: PropertyCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyCategoriesService],
    }).compile();

    service = module.get<PropertyCategoriesService>(PropertyCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
