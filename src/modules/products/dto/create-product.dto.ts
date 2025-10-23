import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsNumber()
  stock?: number;
}
