import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Prisma } from '@prisma/client';

@Controller('customers')
export class CustomersController {
  constructor(private readonly svc: CustomersService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    // Normalize DTO so we don't pass undefined for required DB fields
    const data: Prisma.CustomerCreateInput = {
      name: dto.name,
      address: dto.address ?? '', // if your schema marks address as nullable use null, otherwise '' or remove
      route: dto.route ?? null,
      phone: dto.phone ?? '',
      balance: dto.balance ?? 0,
      category: dto.category ?? '',
    };
    return this.svc.create(data);
  }

  @Get()
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto,
  ) {
    // pass dto directly (partial) — Prisma types accept partial updates
    return this.svc.update(id, dto as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
