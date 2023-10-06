import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  CreatePropertyCategoryRequest,
  FindOnePropertyCategoryRequest,
  UpdatePropertyCategoryRequest,
} from 'src/product/pb/property-category.pb';

export class CreatePropertyCategoryDto
  implements CreatePropertyCategoryRequest
{
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}

export class UpdatePropertyCategoryDto
  implements UpdatePropertyCategoryRequest
{
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: number;

  @IsString()
  @IsOptional()
  public readonly name: string;
}

export class FineOnePropertyCategoryDto
  implements FindOnePropertyCategoryRequest
{
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: number;
}
