import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnDto } from './create-return.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReturnDto extends PartialType(CreateReturnDto) {
  @IsOptional()
  @IsString()
  notes?: string;
}
