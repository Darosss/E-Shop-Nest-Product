import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductProperty } from './entities/product-property.entity';
import { Repository, getRepository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import {
  CreateProductPropertyRequest,
  FindManyProductPropertiesResponse,
  FindOneProductPropertyResponse,
  ProductPropertyOperationResponse,
} from 'src/product/pb/product-property.pb';
import { PropertyService } from 'src/property/property.service';
import { Product } from 'src/product/entities/product.entity';
import { Property } from 'src/property/entities/property.entity';
import {
  FindProductPropertiesByProductIdRequestDto,
  FineOneProductPropertyDto,
  UpdateProductPropertyDto,
} from './dto/product-property.dto';

@Injectable()
export class ProductPropertyService {
  @InjectRepository(ProductProperty)
  private readonly repository: Repository<ProductProperty>;

  @Inject(ProductService)
  private readonly productService: ProductService;

  @Inject(PropertyService)
  private readonly propertyService: PropertyService;

  public async create({
    value,
    productId,
    propertyId,
  }: CreateProductPropertyRequest): Promise<ProductPropertyOperationResponse> {
    const productProperty = new ProductProperty();

    const [product, property] = await Promise.all([
      this.productService.findOne({ id: productId }),
      this.propertyService.findOne({ id: propertyId }),
    ]);

    if (product.error || property.error)
      return {
        id: productId,
        error: [...product.error, ...property.error],
        status: HttpStatus.OK,
        message: '',
      };

    //FIXME: way to work for now, fix types
    productProperty.product = product.data as unknown as Product;
    productProperty.property = property.data as unknown as Property;
    productProperty.value = value;

    await this.repository.save(productProperty);

    return {
      id: productProperty.id,
      error: null,
      message: 'Successfully created product property',
      status: HttpStatus.OK,
    };
  }

  public async findOne({
    id,
  }: FineOneProductPropertyDto): Promise<FindOneProductPropertyResponse> {
    const foundProductProperty = await this.repository.findOne({
      where: { id },
      relations: {
        property: true,
      },
    });

    if (!foundProductProperty) {
      return {
        data: null,
        error: [`Product property with id: ${id} not found`],
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      //FIXME: fix type
      data: foundProductProperty as unknown as FindOneProductPropertyResponse['data'],
      error: null,
      status: HttpStatus.OK,
    };
  }

  public async findAllByProductId({
    productId,
  }: FindProductPropertiesByProductIdRequestDto): Promise<FindManyProductPropertiesResponse> {
    // const foundProductProperty = await this.repository.find({
    //   where: { product: { id: productId } },
    //   relations: {
    //     relations: ['property', 'property.category'],
    //   },
    // });

    const foundProductProperties = await this.repository
      .createQueryBuilder('productProperty')
      .leftJoinAndSelect('productProperty.property', 'property')
      .leftJoinAndSelect('property.category', 'category')
      .where('productProperty.product = :productId', { productId })
      .getMany();

    console.log(foundProductProperties[0].property.category);
    return {
      //FIXME: fix type
      data: foundProductProperties as unknown as FindManyProductPropertiesResponse['data'],
      error: null,
      status: HttpStatus.OK,
    };
  }

  public async updateOne({
    id,
    productId,
    propertyId,
    value,
  }: UpdateProductPropertyDto) {
    const foundProductProperty = await this.repository.findOneBy({ id });

    if (!foundProductProperty)
      return {
        id: productId,
        error: [`Product property with id: ${id} does not exist`],
        status: HttpStatus.OK,
        message: '',
      };

    const [product, property] = await Promise.all([
      this.productService.findOne({ id: productId }),
      this.propertyService.findOne({ id: propertyId }),
    ]);

    //FIXME: fix types
    foundProductProperty.product =
      (product as unknown as Product) || foundProductProperty.product;
    foundProductProperty.property =
      (property as unknown as Property) || foundProductProperty.property;
    foundProductProperty.value = value || foundProductProperty.value;
    await this.repository.save(foundProductProperty);

    return {
      id: id,
      error: null,
      message: 'Successfully updated product property',
      status: HttpStatus.OK,
    };
  }

  public async findAll(): Promise<FindManyProductPropertiesResponse> {
    const foundPropertyCategories = await this.repository.find();
    //FIXME: fix types
    return {
      data: foundPropertyCategories as unknown as FindManyProductPropertiesResponse['data'],
      error: null,
      status: HttpStatus.OK,
    };
  }
}
