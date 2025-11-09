import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { Prisma, UserRole } from '@prisma/client';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('raw-materials')
@UseGuards(AuthGuard, RolesGuard)
export class RawMaterialsController {
  constructor(private readonly svc: RawMaterialsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateRawMaterialDto) {
    const data: Prisma.RawMaterialCreateInput = {
      name: dto.name,
      unit: dto.unit,
      stock: dto.stock ?? 0,
      price: dto.price ?? 0,
    };
    return this.svc.create(data);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
    @Query('search') search?: string,
  ) {
    const skip = (+page - 1) * +perPage;
    const take = +perPage;
    return this.svc.findAll(skip, take, search);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRawMaterialDto,
  ) {
    const data: Prisma.RawMaterialUpdateInput = {
      name: dto.name ?? undefined,
      unit: dto.unit ? { set: dto.unit } : undefined,
      stock: dto.stock ?? undefined,
      price: dto.price ?? undefined,
    };
    return this.svc.update(id, data);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<UpdateRawMaterialDto>,
  ) {
    const data: Prisma.RawMaterialUpdateInput = {
      name: dto.name ?? undefined,
      unit: dto.unit ? { set: dto.unit } : undefined,
      stock: dto.stock ?? undefined,
      price: dto.price ?? undefined,
    };
    return this.svc.update(id, data);
  }

  @Patch(':id/stock')
  @Roles(UserRole.ADMIN)
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { delta: number },
  ) {
    return this.svc.updateStock(id, body.delta);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
