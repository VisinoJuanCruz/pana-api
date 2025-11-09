import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
  Min,
} from 'class-validator';
import { ReturnDestination } from '@prisma/client';

export class CreateReturnItemDto {
  @IsInt()
  returnId: number;

  @IsInt()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  unitPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalValue?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(ReturnDestination)
  destination?: ReturnDestination;

  @IsOptional()
  discountApplied?: boolean; // ⚡ Corregido: propiedad añadida
}
