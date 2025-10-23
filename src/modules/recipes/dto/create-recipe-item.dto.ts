import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateRecipeItemDto {
  @IsInt()
  rawMaterialId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
