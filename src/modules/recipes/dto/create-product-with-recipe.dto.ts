import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateRecipeIngredientDto {
  @IsNumber()
  rawMaterialId: number;

  @IsNumber()
  quantity: number;
}

class CreateRecipeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[];
}

export class CreateProductWithRecipeDto {
  // Datos del producto
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsString()
  category?: string;

  // Datos de la receta asociada (opcional)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRecipeDto)
  recipe: CreateRecipeDto;
}
