// src/modules/inventory/dto/create-inventory.dto.ts
import { IsString, IsOptional, IsNumber, IsIn, IsInt } from 'class-validator';
import { Unit } from '@prisma/client';

export class CreateInventoryDto {
  @IsString()
  itemType: 'product' | 'rawMaterial';

  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsInt()
  rawMaterialId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsIn([
    'UNIT',
    'GRAM',
    'KILOGRAM',
    'MILLILITER',
    'LITER',
    'TABLESPOON',
    'TEASPOON',
  ])
  unit?: Unit;

  @IsOptional()
  @IsString()
  note?: string;
}
