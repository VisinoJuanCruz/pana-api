import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';
import { BalanceType } from '@prisma/client';

export class UpdateCustomerBalanceDto {
  @IsOptional()
  type?: BalanceType;

  @IsOptional()
  amount?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  date?: string;

  @IsOptional()
  paymentId?: number;
}
