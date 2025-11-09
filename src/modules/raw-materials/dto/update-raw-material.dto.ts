import { PartialType } from '@nestjs/mapped-types';
import { CreateRawMaterialDto } from './create-raw-material.dto';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Unit } from '@prisma/client';

export class UpdateRawMaterialDto extends PartialType(CreateRawMaterialDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Unit)
  unit?: Unit;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}
