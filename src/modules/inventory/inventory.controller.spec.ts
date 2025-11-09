// src/modules/inventory/inventory.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  create(@Body() dto: CreateInventoryDto) {
    return this.svc.create(dto);
  }

  @Post('bulk')
  @Roles(UserRole.ADMIN)
  bulkCreate(@Body() dtos: CreateInventoryDto[]) {
    return this.svc.bulkCreate(dtos);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.EMPLOYEE)
  findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
    @Query('itemType') itemType?: string,
    @Query('productId') productId?: string,
    @Query('rawMaterialId') rawMaterialId?: string,
    @Query('unit') unit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('note') noteContains?: string,
  ) {
    const p = +page;
    const pp = +perPage;
    return this.svc.findAll(p, pp, {
      itemType,
      productId: productId ? +productId : undefined,
      rawMaterialId: rawMaterialId ? +rawMaterialId : undefined,
      unit,
      from,
      to,
      noteContains,
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
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Patch(':id/adjust')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  adjust(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdjustInventoryDto,
  ) {
    return this.svc.adjust(id, dto.delta);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.delete(id);
  }
}
