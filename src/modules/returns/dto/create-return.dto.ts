import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReturnItemDto {
  @IsInt()
  productId: number;

  @Min(0)
  quantity: number;

  @Min(0)
  unitPrice: number;

  @Min(0)
  totalValue: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  destination?: 'DISCARDED' | 'RALLADO' | 'DISCOUNTED';

  @IsOptional()
  discountApplied?: boolean;
}

export class CreateReturnDto {
  @IsInt()
  customerId: number;

  @IsOptional()
  @IsInt()
  deliveryPersonId?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  totalLoss?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  items?: CreateReturnItemDto[];
}
