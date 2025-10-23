// src/modules/deliveries/dto/update-delivery.dto.ts
import { IsOptional, IsInt, IsEnum } from 'class-validator';
import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsInt()
  deliveryPersonId?: number;

  @IsOptional()
  date?: Date;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @IsOptional()
  items?: { productId: number; quantity: number }[];
}
