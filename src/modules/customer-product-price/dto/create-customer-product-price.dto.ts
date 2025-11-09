import { IsInt, IsNumber } from 'class-validator';

export class CreateCustomerProductPriceDto {
  @IsInt()
  customerId: number;

  @IsInt()
  productId: number;

  @IsNumber()
  customPrice: number;
}
