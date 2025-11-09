import {
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
} from 'class-validator';
import { BalanceType } from '@prisma/client';

export class CreateCustomerBalanceDto {
  @IsInt()
  customerId: number;

  @IsEnum(BalanceType)
  type: BalanceType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  paymentId?: number; // asociar a un payment existente

  @IsOptional()
  @IsDateString()
  date?: string;
}
