import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Unit } from '@prisma/client';

export class CreateRawMaterialDto {
  @IsString()
  name: string;

  @IsEnum(Unit)
  unit: Unit;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}
