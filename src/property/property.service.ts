import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreatePropertyDto,
  FineOnePropertyDto,
  UpdatePropertyDto,
} from './dto/property.dto';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyCategoriesService } from 'src/property-category/property-categories.service';
import { PropertyCategory } from 'src/property-category/entities/property-category.entity';
import { PropertyCategoryOperationResponse } from 'src/product/pb/property-category.pb';

@Injectable()
export class PropertyService {
  @InjectRepository(Property)
  private readonly repository: Repository<Property>;

  @Inject(PropertyCategoriesService)
  private readonly propertyCategoryService: PropertyCategoriesService;

  public async create({
    name,
    categoryId,
  }: CreatePropertyDto): Promise<PropertyCategoryOperationResponse> {
    const property = new Property();

    const foundCategory = await this.propertyCategoryService.findOne({
      id: categoryId,
    });

    console.log(foundCategory);
    if (foundCategory.error) {
      return {
        id: property.id,
        error: foundCategory.error,
        message: '',
        status: HttpStatus.NOT_FOUND,
      };
    }

    property.name = name;
    //FIXME: fix type
    property.category = foundCategory.data as unknown as PropertyCategory;

    await this.repository.save(property);

    return {
      id: property.id,
      error: null,
      message: 'Successfully created property',
      status: HttpStatus.OK,
    };
  }

  public async findOne({ id }: FineOnePropertyDto) {
    const property = await this.repository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!property) {
      return {
        data: null,
        error: [`Property with id: ${id} not found`],
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: property,
      error: null,
      status: HttpStatus.OK,
    };
  }
  public async updateOne({ id, name, categoryId }: UpdatePropertyDto) {
    const foundProperty = await this.repository.findOneBy({ id });

    if (!foundProperty) {
      return {
        id: id,
        error: [`Property with provided id: ${id} does not exist`],
        message: 'Error',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const foundCategory = await this.propertyCategoryService.findOne({
      id: categoryId,
    });

    if (foundCategory.error) {
      return {
        id: id,
        error: foundCategory.error,
        message: '',
        status: foundCategory.status,
      };
    }

    foundProperty.name = name || foundProperty.name;
    foundProperty.category =
      (foundCategory.data as PropertyCategory) || foundProperty.category;

    await this.repository.save(foundProperty);

    return {
      id: id,
      error: null,
      message: 'Successfully updated property',
      status: HttpStatus.OK,
    };
  }
  public async findAll() {
    const foundPropertyCategories = await this.repository.find();

    return {
      data: foundPropertyCategories,
      error: null,
      status: HttpStatus.OK,
    };
  }
}
