import { IsInt, IsString, Length, NotEquals } from 'class-validator';

export class AdjustStockDto {
  @IsInt()
  @NotEquals(0)
  quantityChange: number;

  @IsString()
  @Length(2, 100)
  reason: string;
}
