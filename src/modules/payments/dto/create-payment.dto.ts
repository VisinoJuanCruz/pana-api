import {
  IsInt,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { BalanceType } from '@prisma/client';

export class CreatePaymentDto {
  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsInt()
  deliveryId?: number;

  @IsNumber()
  amount: number;

  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
