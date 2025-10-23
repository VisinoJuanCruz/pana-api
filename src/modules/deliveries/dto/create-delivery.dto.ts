// src/modules/deliveries/dto/create-delivery.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { DeliveryStatus } from '@prisma/client';

export class CreateDeliveryDto {
  @Type(() => Number)
  @IsInt()
  deliveryPersonId: number;

  @Type(() => Number)
  @IsInt()
  orderId: number;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;
}
