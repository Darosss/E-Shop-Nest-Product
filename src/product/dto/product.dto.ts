import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import {
  CreateProductRequest,
  DecreaseStockRequest,
  FindOneProductRequest,
  UpdateProductRequest,
} from '../pb/product.pb';

export class FindOneRequestDto implements FindOneProductRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;
}

export class CreateProductRequestDto implements CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  public readonly sku: string;

  @IsString()
  @IsOptional()
  public readonly description: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  public readonly stock: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  public readonly price: number;

  @IsString()
  @IsNotEmpty()
  public brand!: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  public category!: number;
}

export class DecreaseStockRequestDto implements DecreaseStockRequest {
  @Min(0)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;

  @Min(0)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly userId: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  public readonly orderId: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  public readonly quantity: number;

  @IsString()
  @IsNotEmpty()
  public readonly reason: string;
}

export class UpdateProductRequestDto implements UpdateProductRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsString()
  @IsOptional()
  public readonly description: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  public readonly stock: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  public readonly price: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public brand!: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  public category!: number;
}
