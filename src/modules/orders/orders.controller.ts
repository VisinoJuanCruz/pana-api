import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 👑 Solo ADMIN puede crear pedidos
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  // 👑 ADMIN y EMPLOYEE pueden ver pedidos
  @Roles('ADMIN', 'EMPLOYEE')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('search') search?: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll(
      Number(page) || 1,
      Number(perPage) || 10,
      search,
      status,
    );
  }

  // 👑 ADMIN y EMPLOYEE pueden ver detalle
  @Roles('ADMIN', 'EMPLOYEE')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  // 🚚 Solo EMPLOYEE puede cambiar el estado
  @Roles('EMPLOYEE')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const statusEnum = OrderStatus[status as keyof typeof OrderStatus];
    return this.ordersService.updateStatus(Number(id), statusEnum);
  }

  // 👑 Solo ADMIN puede asignar repartidor
  @Roles('ADMIN')
  @Patch(':id/assign-delivery/:deliveryId')
  assignDelivery(
    @Param('id') orderId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.ordersService.assignDeliveryPerson(
      Number(orderId),
      Number(deliveryId),
    );
  }

  // 👑 Solo ADMIN puede clonar pedidos
  @Roles('ADMIN')
  @Post('clone-tomorrow')
  cloneTomorrowOrders() {
    return this.ordersService.cloneTodayOrdersForTomorrow();
  }

  // 👑 Solo ADMIN puede eliminar
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(Number(id));
  }
}
