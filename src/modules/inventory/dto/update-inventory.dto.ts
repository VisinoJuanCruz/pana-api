// src/modules/inventory/dto/update-inventory.dto.ts
import { IsOptional, IsString, IsNumber, IsIn, IsInt } from 'class-validator';
import { Unit } from '@prisma/client';

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  itemType?: 'product' | 'rawMaterial';

  @IsOptional()
  @IsInt()
  productId?: number | null;

  @IsOptional()
  @IsInt()
  rawMaterialId?: number | null;

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
  unit?: Unit | null;

  @IsOptional()
  @IsString()
  note?: string | null;
}
