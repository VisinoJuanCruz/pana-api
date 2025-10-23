import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  name: string;

  @IsString()
  unit: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
