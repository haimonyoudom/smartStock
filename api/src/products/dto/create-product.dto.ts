import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9-]+$/)
  sku: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  sellingPrice: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsInt()
  @Min(0)
  lowStockThreshold: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
