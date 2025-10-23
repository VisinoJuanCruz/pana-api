import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class RecipeItemDto {
  @IsNumber()
  rawMaterialId: number;

  @IsNumber()
  quantity: number;
}

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeItemDto)
  ingredients: RecipeItemDto[];
}
