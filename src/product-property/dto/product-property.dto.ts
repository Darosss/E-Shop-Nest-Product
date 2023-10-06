import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  CreateProductPropertyRequest,
  FindOneProductPropertyRequest,
  FindProductPropertiesByProductIdRequest,
  UpdateProductPropertyRequest,
} from 'src/product/pb/product-property.pb';

export class CreateProductPropertiesDto
  implements CreateProductPropertyRequest
{
  @IsString()
  @IsNotEmpty()
  public readonly value: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly productId: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly propertyId: number;
}

export class UpdateProductPropertyDto implements UpdateProductPropertyRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly value?: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  public readonly productId?: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  public readonly propertyId?: number;
}

export class FindProductPropertiesByProductIdRequestDto
  implements FindProductPropertiesByProductIdRequest
{
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly productId: number;
}

export class FineOneProductPropertyDto
  implements FindOneProductPropertyRequest
{
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: number;
}
