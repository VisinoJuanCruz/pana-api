import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCashClosureDto {
  @IsInt()
  @IsNotEmpty()
  deliveryId: number;

  @IsNumber()
  @IsPositive()
  total: number;
}
