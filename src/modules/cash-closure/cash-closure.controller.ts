import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CashClosuresService } from './cash-closure.service';
import { CashClosure, UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('cash-closures')
export class CashClosuresController {
  constructor(private readonly service: CashClosuresService) {}

  // Solo ADMIN puede crear cierres manuales o en lote
  @Roles(UserRole.ADMIN)
  @Post()
  create(
    @Body() data: { deliveryId: number; total: number },
  ): Promise<CashClosure> {
    return this.service.create(data);
  }

  @Roles(UserRole.ADMIN)
  @Post('bulk')
  createMany(
    @Body() data: { deliveryId: number; total: number }[],
  ): Promise<CashClosure[]> {
    return this.service.createMany(data);
  }

  // ADMIN ve todo, DELIVERY solo sus cierres
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Get()
  async findAll(
    @Req() req,
    @Query('deliveryId') deliveryId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('includeDeliveries') includeDeliveries?: string,
  ) {
    const user = req.user;

    // Delivery solo puede ver sus propios cierres
    if (user.role === UserRole.EMPLOYEE) {
      deliveryId = String(user.id);
    }

    return this.service.findAll({
      deliveryId: deliveryId ? Number(deliveryId) : undefined,
      from,
      to,
      includeDeliveries: includeDeliveries === 'true',
    });
  }

  // ADMIN puede consultar rango de fechas
  @Roles(UserRole.ADMIN)
  @Get('range')
  findByDateRange(@Query('from') from: string, @Query('to') to: string) {
    return this.service.findByDateRange(from, to);
  }

  // ADMIN ve totales globales, DELIVERY solo los propios
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Get('sum')
  async getTotalSum(
    @Req() req,
    @Query('deliveryId') deliveryId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const user = req.user;
    if (user.role === UserRole.EMPLOYEE) {
      deliveryId = String(user.id);
    }

    return this.service.getTotalSum({
      deliveryId: deliveryId ? Number(deliveryId) : undefined,
      from,
      to,
    });
  }

  // Solo ADMIN obtiene resumen global
  @Roles(UserRole.ADMIN)
  @Get('summary')
  getSummaryByDelivery() {
    return this.service.getSummaryByDelivery();
  }

  // ADMIN ve todos los cierres recientes, DELIVERY los suyos
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async getLastClosures(@Req() req, @Query('limit') limit?: string) {
    const user = req.user;
    const closures = await this.service.getLastClosures(
      limit ? Number(limit) : 5,
    );

    if (user.role === UserRole.EMPLOYEE) {
      return closures.filter((c) => c.deliveryId === user.id);
    }

    return closures;
  }

  // ADMIN puede ver cualquier cierre, DELIVERY solo el propio
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<CashClosure> {
    const closure = await this.service.findOne(id);
    const user = req.user;

    if (user.role === UserRole.EMPLOYEE && closure.deliveryId !== user.id) {
      throw new ForbiddenException('No tienes acceso a este cierre');
    }

    return closure;
  }

  // Solo ADMIN modifica o elimina cierres
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CashClosure>,
  ): Promise<CashClosure> {
    return this.service.update(id, data);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
