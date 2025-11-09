import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerProductPriceDto } from './create-customer-product-price.dto';

export class UpdateCustomerProductPriceDto extends PartialType(
  CreateCustomerProductPriceDto,
) {
  @IsOptional()
  @IsNumber()
  customPrice?: number;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsInt()
  productId?: number;
}
