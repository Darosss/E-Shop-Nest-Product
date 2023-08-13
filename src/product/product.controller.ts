import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateProductRequestDto,
  FindOneRequestDto,
  DecreaseStockRequestDto,
  UpdateProductRequestDto,
} from './dto/product.dto';
import {
  ProductOperationResponse,
  FindOneProductResponse,
  PRODUCT_SERVICE_NAME,
  DecreaseStockResponse,
  GetProductsByIdsRequest,
  GetProductsByIdsResponse,
  CheckProductsQuantityAvailabilityRequest,
  CheckProductsQuantityAvailabilityResponse,
  DecreaseMultipleStockProductsRequest,
  DecreaseMultipleStockProductsResponse,
  SumProductsPriceResponse,
  SumProductsPriceRequest,
  FindAllProductsRequest,
  FindAllProductsResponse,
  FindProductsCountByCategoryIdRequest,
  FindProductsCountByCategoryIdResponse,
} from './pb/product.pb';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  @Inject(ProductService)
  private readonly service: ProductService;

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'CreateProduct')
  private createProduct(
    payload: CreateProductRequestDto,
  ): Promise<ProductOperationResponse> {
    return this.service.createProduct(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'UpdateProduct')
  private updateProduct(
    payload: UpdateProductRequestDto,
  ): Promise<ProductOperationResponse> {
    return this.service.updateProduct(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'FindOne')
  private findOne(payload: FindOneRequestDto): Promise<FindOneProductResponse> {
    return this.service.findOne(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'FindAll')
  private findAll(
    payload: FindAllProductsRequest,
  ): Promise<FindAllProductsResponse> {
    return this.service.findAll(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'DecreaseStock')
  private decreaseStock(
    payload: DecreaseStockRequestDto,
  ): Promise<DecreaseStockResponse> {
    return this.service.decreaseStock(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'GetProductsByIds')
  private getProductsByIds({
    ids,
  }: GetProductsByIdsRequest): Promise<GetProductsByIdsResponse> {
    return this.service.getProductsByIds(ids);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'CheckProductsQuantityAvailability')
  private checkProductsQuantityAvailability({
    products,
  }: CheckProductsQuantityAvailabilityRequest): Promise<CheckProductsQuantityAvailabilityResponse> {
    return this.service.checkProductsQuantityAvailability({
      products,
    });
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'DecreaseMultipleStockProducts')
  private decreaseMultipleStockProducts(
    payload: DecreaseMultipleStockProductsRequest,
  ): Promise<DecreaseMultipleStockProductsResponse> {
    return this.service.decreaseMultipleStockProducts(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'SumProductsPrice')
  private sumProductsPrice({
    products,
  }: SumProductsPriceRequest): Promise<SumProductsPriceResponse> {
    return this.service.sumProductsPrice({ products });
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'FindProductsCountByCategoryId')
  private findProductsCountByCategoryId({
    categoriesIds,
  }: FindProductsCountByCategoryIdRequest): Promise<FindProductsCountByCategoryIdResponse> {
    return this.service.findProductsCountByCategoryId({ categoriesIds });
  }
}
