import { Controller, Post, Get, Param, Patch, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const statusEnum = OrderStatus[status as keyof typeof OrderStatus];
    return this.ordersService.updateStatus(+id, statusEnum);
  }

  @Patch(':id/assign-delivery/:deliveryId')
  assignDelivery(
    @Param('id') orderId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.ordersService.assignDeliveryPerson(+orderId, +deliveryId);
  }
}
