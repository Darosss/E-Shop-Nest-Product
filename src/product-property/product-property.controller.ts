import { Controller, Inject } from '@nestjs/common';
import { ProductPropertyService } from './product-property.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindManyProductPropertiesResponse,
  FindOneProductPropertyResponse,
  PRODUCT_PROPERTY_SERVICE_NAME,
  ProductPropertyOperationResponse,
} from 'src/product/pb/product-property.pb';
import {
  CreateProductPropertiesDto,
  FindProductPropertiesByProductIdRequestDto,
  FineOneProductPropertyDto,
  UpdateProductPropertyDto,
} from './dto/product-property.dto';

@Controller()
export class ProductPropertyController {
  @Inject(ProductPropertyService)
  private readonly productPropertyService: ProductPropertyService;

  @GrpcMethod(PRODUCT_PROPERTY_SERVICE_NAME, 'Create')
  private createProductProperty(
    payload: CreateProductPropertiesDto,
  ): Promise<ProductPropertyOperationResponse> {
    return this.productPropertyService.create(payload);
  }

  @GrpcMethod(PRODUCT_PROPERTY_SERVICE_NAME, 'FindOne')
  private findOneProductProperty(
    payload: FineOneProductPropertyDto,
  ): Promise<FindOneProductPropertyResponse> {
    return this.productPropertyService.findOne(payload);
  }

  @GrpcMethod(PRODUCT_PROPERTY_SERVICE_NAME, 'Update')
  private updateProductProperty(
    payload: UpdateProductPropertyDto,
  ): Promise<ProductPropertyOperationResponse> {
    return this.productPropertyService.updateOne(payload);
  }

  @GrpcMethod(PRODUCT_PROPERTY_SERVICE_NAME, 'FindAll')
  private findAllPropertyCategories(): Promise<FindManyProductPropertiesResponse> {
    return this.productPropertyService.findAll();
  }

  @GrpcMethod(PRODUCT_PROPERTY_SERVICE_NAME, 'FindProductPropertiesByProductId')
  private findProductPropertiesByProductId(
    payload: FindProductPropertiesByProductIdRequestDto,
  ): Promise<FindManyProductPropertiesResponse> {
    return this.productPropertyService.findAllByProductId(payload);
  }
}
