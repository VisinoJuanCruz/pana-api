import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  deliveryId: number;

  @IsNumber()
  amount: number;

  @IsString()
  method: string; // e.g. "CASH", "CARD", "TRANSFER"

  @IsOptional()
  @IsString()
  note?: string;
}
