// src/modules/inventory/dto/adjust-inventory.dto.ts
import { IsNumber } from 'class-validator';

export class AdjustInventoryDto {
  @IsNumber()
  delta: number; // positivo para sumar, negativo para restar
}
