// src/modules/deliveries/deliveries.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveriesController {
  constructor(private readonly svc: DeliveriesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  create(@Body() dto: CreateDeliveryDto) {
    return this.svc.create(dto);
  }

  /**
   * GET /deliveries?page=1&perPage=10
   * filtros:
   * - status (PENDING|DELIVERED|CANCELLED)
   * - deliveryPersonId
   * - customerName
   * - deliveryPersonName
   * - from (YYYY-MM-DD)
   * - to (YYYY-MM-DD)
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '10',
    @Query('status') status?: string,
    @Query('deliveryPersonId') deliveryPersonId?: string,
    @Query('customerName') customerName?: string,
    @Query('deliveryPersonName') deliveryPersonName?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const pageN = Number(page || 1);
    const perPageN = Number(perPage || 10);

    const filters: any = {};
    if (status) filters.status = status;
    if (deliveryPersonId) filters.deliveryPersonId = Number(deliveryPersonId);
    if (customerName) filters.customerName = customerName;
    if (deliveryPersonName) filters.deliveryPersonName = deliveryPersonName;
    if (from) filters.from = from;
    if (to) filters.to = to;

    return this.svc.findAll(pageN, perPageN, filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  // PATCH parcial (deliveryPersonId, date, status, items)
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeliveryDto,
  ) {
    return this.svc.update(id, dto);
  }

  // marcar como entregada; body opcional { amountPaid, method }
  @Patch(':id/deliver')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  markAsDelivered(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amountPaid?: number; method?: string },
  ) {
    return this.svc.markAsDelivered(id, body.amountPaid, body.method);
  }

  @Get(':id/payments')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  getPayments(@Param('id', ParseIntPipe) id: number) {
    return this.svc.getPayments(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.delete(id);
  }
}
