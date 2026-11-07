import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateSaleItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class CreateSaleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}
