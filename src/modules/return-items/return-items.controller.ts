// src/return-items/return-items.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReturnItemsService } from './return-items.service';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ReturnDestination } from '@prisma/client';

@Controller('return-items')
@UseGuards(AuthGuard, RolesGuard)
export class ReturnItemsController {
  constructor(private svc: ReturnItemsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateReturnItemDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(
    @Query('returnId') returnId?: string,
    @Query('productId') productId?: string,
    @Query('destination') destination?: ReturnDestination,
    @Query('reasonContains') reasonContains?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.svc.findAll({
      returnId: returnId ? +returnId : undefined,
      productId: productId ? +productId : undefined,
      destination,
      reasonContains,
      from,
      to,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReturnItemDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.delete(id);
  }
}
