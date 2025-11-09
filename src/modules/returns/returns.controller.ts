// src/returns/returns.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('returns')
@UseGuards(AuthGuard, RolesGuard)
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateReturnDto) {
    return this.returnsService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('customerId') customerId?: string,
    @Query('deliveryPersonId') deliveryPersonId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.returnsService.findAll(+page, +perPage, {
      customerId: customerId ? +customerId : undefined,
      deliveryPersonId: deliveryPersonId ? +deliveryPersonId : undefined,
      from,
      to,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.returnsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReturnDto) {
    return this.returnsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.returnsService.remove(id);
  }
}
