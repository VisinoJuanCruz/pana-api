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
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.svc.create(dto);
  }

  // Bulk create
  @Post('bulk')
  bulkCreate(@Body() dtos: CreateInventoryDto[]) {
    return this.svc.bulkCreate(dtos);
  }

  @Get()
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.svc.update(id, dto);
  }

  // Ajustar cantidad: body { delta: number }
  @Patch(':id/adjust')
  adjust(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdjustInventoryDto,
  ) {
    return this.svc.adjust(id, dto.delta);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.delete(id);
  }
}
