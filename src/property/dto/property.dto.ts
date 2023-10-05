import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  CreatePropertyRequest,
  FindOnePropertyRequest,
  UpdatePropertyRequest,
} from 'src/product/pb/property.pb';

export class FindOnePropertyRequestDto {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;
}

export class CreatePropertyDto implements CreatePropertyRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly categoryId: number;
}

export class UpdatePropertyDto implements UpdatePropertyRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly name?: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  public readonly categoryId?: number;
}

export class FineOnePropertyDto implements FindOnePropertyRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: number;
}
