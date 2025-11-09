// src/modules/delivery-persons/dto/create-delivery-person.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateDeliveryPersonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  vehicle?: string;
}
