import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnDestination } from '@prisma/client';

class ReturnItemDto {
  @IsInt()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalValue: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsEnum(ReturnDestination)
  destination: ReturnDestination;
}

export class CreateReturnDto {
  @IsInt()
  customerId: number;

  @IsOptional()
  @IsInt()
  deliveryPersonId?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[];
}
