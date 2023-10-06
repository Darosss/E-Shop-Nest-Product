import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyCategory } from './entities/property-category.entity';
import { Repository } from 'typeorm';
import {
  CreatePropertyCategoryDto,
  FineOnePropertyCategoryDto,
  UpdatePropertyCategoryDto,
} from './dto/property-categories.dto';
import { FindOnePropertyCategoryResponse } from 'src/product/pb/property-category.pb';

@Injectable()
export class PropertyCategoriesService {
  @InjectRepository(PropertyCategory)
  private readonly repository: Repository<PropertyCategory>;

  public async create(payload: CreatePropertyCategoryDto) {
    const propertyCategory = new PropertyCategory();

    propertyCategory.name = payload.name;

    await this.repository.save(propertyCategory);

    return {
      id: propertyCategory.id,
      error: null,
      message: 'Successfully created property category',
      status: HttpStatus.OK,
    };
  }

  public async findOne({
    id,
  }: FineOnePropertyCategoryDto): Promise<FindOnePropertyCategoryResponse> {
    const propertyCategory = await this.repository.findOne({ where: { id } });

    if (!propertyCategory) {
      return {
        data: null,
        error: ['Property category not found'],
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: propertyCategory,
      error: null,
      status: HttpStatus.OK,
    };
  }
  public async updateOne({ id, name }: UpdatePropertyCategoryDto) {
    const foundPropertyCategory = await this.repository.findOneBy({ id });

    if (!foundPropertyCategory) {
      return {
        id: id,
        error: [`Product with provided id does not exist`],
        message: 'Error',
        status: HttpStatus.NOT_FOUND,
      };
    }

    foundPropertyCategory.name = name || foundPropertyCategory.name;

    await this.repository.save(foundPropertyCategory);

    return {
      id: id,
      error: null,
      message: 'Successfully updated property category',
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
