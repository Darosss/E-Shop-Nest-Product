import { Controller, Inject } from '@nestjs/common';
import { PropertyCategoriesService } from './property-categories.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindAllPropertyCategoriesResponse,
  FindOnePropertyCategoryResponse,
  PROPERTY_CATEGORIES_SERVICE_NAME,
  PropertyCategoryOperationResponse,
} from 'src/product/pb/property-category.pb';
import {
  CreatePropertyCategoryDto,
  FineOnePropertyCategoryDto,
  UpdatePropertyCategoryDto,
} from './dto/property-categories.dto';

@Controller()
export class PropertyCategoriesController {
  @Inject(PropertyCategoriesService)
  private readonly propertyCategoriesService: PropertyCategoriesService;

  @GrpcMethod(PROPERTY_CATEGORIES_SERVICE_NAME, 'Create')
  private createPropertyCategory(
    payload: CreatePropertyCategoryDto,
  ): Promise<PropertyCategoryOperationResponse> {
    return this.propertyCategoriesService.create(payload);
  }

  @GrpcMethod(PROPERTY_CATEGORIES_SERVICE_NAME, 'FindOne')
  private findOne(
    payload: FineOnePropertyCategoryDto,
  ): Promise<FindOnePropertyCategoryResponse> {
    return this.propertyCategoriesService.findOne(payload);
  }

  @GrpcMethod(PROPERTY_CATEGORIES_SERVICE_NAME, 'Update')
  private updatePropertyCategory(
    payload: UpdatePropertyCategoryDto,
  ): Promise<PropertyCategoryOperationResponse> {
    return this.propertyCategoriesService.updateOne(payload);
  }

  @GrpcMethod(PROPERTY_CATEGORIES_SERVICE_NAME, 'FindAll')
  private findAllPropertyCategories(): Promise<FindAllPropertyCategoriesResponse> {
    return this.propertyCategoriesService.findAll();
  }
}
