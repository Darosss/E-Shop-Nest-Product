import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  CreateProductRequestDto,
  DecreaseStockRequestDto,
  FindOneRequestDto,
  UpdateProductRequestDto,
} from './dto/product.dto';
import {
  ProductOperationResponse,
  DecreaseStockResponse,
  FindOneProductResponse,
  GetProductsByIdsResponse,
  CheckProductsQuantityAvailabilityResponse,
  CheckProductsQuantityAvailabilityRequest,
  DecreaseMultipleStockProductsRequest,
  DecreaseMultipleStockProductsResponse,
  SumProductsPriceRequest,
  SumProductsPriceResponse,
  FindAllProductsResponse,
  FindAllProductsRequest,
  FindProductsCountByCategoryIdRequest,
  FindProductsCountByCategoryIdResponse,
} from './pb/product.pb';
import { StockDecreaseLog } from './entities/stock-decrease-log.entity';
import { CATEGORY_SERVICE_NAME, CategoryServiceClient } from './pb/category.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService implements OnModuleInit {
  private categorySvc: CategoryServiceClient;

  @Inject(CATEGORY_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(Product)
  private readonly repository: Repository<Product>;

  @InjectRepository(StockDecreaseLog)
  private readonly decreaseLogRepository: Repository<StockDecreaseLog>;

  public onModuleInit(): void {
    this.categorySvc = this.client.getService<CategoryServiceClient>(
      CATEGORY_SERVICE_NAME,
    );
  }

  public async findAll({
    categories,
    queries = {
      sort: { sortBy: 'name', sortOrder: 1 },
      pagination: { limit: 20, page: 0 },
    },
  }: FindAllProductsRequest): Promise<FindAllProductsResponse> {
    const {
      pagination,
      sort: { sortOrder, sortBy },
    } = queries;
    const queryBuilder = this.repository.createQueryBuilder('product');

    if (categories) {
      queryBuilder.where('product.category IN (:...categories)', {
        categories,
      });
    }
    queryBuilder
      .take(pagination.limit || 20)
      .skip(pagination.page * pagination.limit || 0);

    if (sortBy && sortBy) {
      const columnName = sortBy;
      queryBuilder.orderBy(columnName, sortOrder === 1 ? 'ASC' : 'DESC');
    }

    const products = await queryBuilder.getMany();

    if (!products) {
      return {
        data: null,
        error: ['Products not found'],
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: products,
      error: null,
      status: HttpStatus.OK,
    };
  }

  public async findOne({
    id,
  }: FindOneRequestDto): Promise<FindOneProductResponse> {
    const product: Product = await this.repository.findOne({ where: { id } });

    if (!product) {
      return {
        data: null,
        error: ['Product not found'],
        status: HttpStatus.NOT_FOUND,
      };
    }

    const category = await firstValueFrom(
      this.categorySvc.findOne({ id: product.category }),
    );

    return {
      data: { ...product, category: category.data },
      error: null,
      status: HttpStatus.OK,
    };
  }

  public async createProduct(
    payload: CreateProductRequestDto,
  ): Promise<ProductOperationResponse> {
    if (
      (await firstValueFrom(this.categorySvc.findOne({ id: payload.category })))
        .status !== HttpStatus.OK
    ) {
      return {
        id: payload.category,
        error: [`Category with provided id does not exist`],
        message: 'Error',
        status: HttpStatus.NOT_FOUND,
      };
    }
    const product: Product = new Product();

    product.name = payload.name;
    product.sku = payload.sku;
    product.stock = payload.stock;
    product.price = payload.price;
    product.brand = payload.brand;
    product.description = payload.description;
    product.category = payload.category;

    await this.repository.save(product);

    return {
      id: product.id,
      error: null,
      message: 'Successfully created product',
      status: HttpStatus.OK,
    };
  }

  public async updateProduct(
    payload: UpdateProductRequestDto,
  ): Promise<ProductOperationResponse> {
    const { id, name, description, stock, price, brand, category } = payload;

    if (
      payload.category &&
      (await firstValueFrom(this.categorySvc.findOne({ id: payload.category })))
        .status !== HttpStatus.OK
    ) {
      return {
        id: payload.category,
        error: [`Category with provided id does not exist`],
        message: 'Error',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const product = await this.repository.findOneBy({ id });

    if (!product)
      return {
        id: id,
        error: [`Product with provided id does not exist`],
        message: 'Error',
        status: HttpStatus.NOT_FOUND,
      };

    product.category = category || product.category;
    product.name = name || product.name;
    product.stock = stock || product.stock;
    product.price = price || product.price;
    product.brand = brand || product.brand;
    product.description = description || product.description;

    await this.repository.save(product);

    return {
      id: product.id,
      error: null,
      message: 'Successfully updated product',
      status: HttpStatus.OK,
    };
  }

  public async decreaseStock({
    id,
    userId,
    quantity,
    reason,
    orderId,
  }: DecreaseStockRequestDto): Promise<DecreaseStockResponse> {
    const product: Product = await this.repository.findOne({
      select: ['id', 'stock', 'sold'],
      where: { id },
    });

    if (!product) {
      return { error: ['Product not found'], status: HttpStatus.NOT_FOUND };
    } else if (product.stock < quantity) {
      return { error: ['Stock too low'], status: HttpStatus.CONFLICT };
    }

    const isAlreadyDecreased: number = await this.decreaseLogRepository.count({
      where: { product: { id: id }, orderId },
    });

    if (isAlreadyDecreased) {
      return {
        error: ['Stock already decreased'],
        status: HttpStatus.CONFLICT,
      };
    }

    await this.repository.update(product.id, {
      stock: product.stock - quantity,
      sold: product.sold + quantity,
    });

    await this.decreaseLogRepository.insert({
      product,
      userId,
      quantity,
      previousStockQuantity: product.stock,
      currentStockQuantity: product.stock - quantity,
      reason: reason,
      orderId: orderId || null,
    });

    return { error: null, status: HttpStatus.OK };
  }

  public async getProductsByIds(
    ids: number[],
  ): Promise<GetProductsByIdsResponse> {
    const products = await this.repository
      .createQueryBuilder('product')
      .where('product.id IN (:...ids)', { ids })
      .getMany();

    return { data: products, error: null, status: HttpStatus.OK };
  }

  public async checkProductsQuantityAvailability({
    products,
  }: CheckProductsQuantityAvailabilityRequest): Promise<CheckProductsQuantityAvailabilityResponse> {
    for (const productId in products) {
      const quantity = products[productId];

      const product = await this.repository.findOneBy({
        id: parseInt(productId, 10),
      });

      if (!product)
        return { status: 404, error: ['One of products does not exist'] };

      if (product.stock < quantity)
        return {
          status: 422,
          error: ['At least one of products are out of stock'],
        };
    }

    return { status: 200, error: null };
  }

  public async decreaseMultipleStockProducts({
    products,
    userId,
    reason,
    orderId,
  }: DecreaseMultipleStockProductsRequest): Promise<DecreaseMultipleStockProductsResponse> {
    for (const productId in products) {
      const quantity = products[productId];

      const { status, error } = await this.decreaseStock({
        id: parseInt(productId, 10),
        userId,
        reason,
        quantity,
        orderId,
      });

      if (error !== null) {
        return { status: status, error: error };
      }
    }

    return { status: 200, error: null };
  }

  public async sumProductsPrice({
    products,
  }: SumProductsPriceRequest): Promise<SumProductsPriceResponse> {
    let sumPrice = 0;
    for (const productId in products) {
      const quantity = products[productId];

      const { price } = await this.repository.findOneBy({
        id: parseInt(productId, 10),
      });
      sumPrice += price * quantity;
    }

    return { data: { price: sumPrice }, status: 200, error: null };
  }

  public async findProductsCountByCategoryId({
    categoriesIds,
  }: FindProductsCountByCategoryIdRequest): Promise<FindProductsCountByCategoryIdResponse> {
    const productsCount = await this.repository.count({
      where: { category: In(categoriesIds) },
    });

    return {
      data: { productsCount },
      status: 200,
      error: null,
    };
  }
}
