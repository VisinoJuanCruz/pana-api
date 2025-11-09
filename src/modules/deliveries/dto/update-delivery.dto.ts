import {
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { DeliveryStatus } from '@prisma/client';
import { Type } from 'class-transformer';

class DeliveryItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}

export class UpdateDeliveryDto {
  @IsOptional()
  @IsInt()
  deliveryPersonId?: number;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryItemDto)
  items?: DeliveryItemDto[];
}
