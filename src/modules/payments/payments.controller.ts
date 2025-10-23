import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private svc: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get('delivery/:deliveryId')
  findByDelivery(@Param('deliveryId', ParseIntPipe) deliveryId: number) {
    return this.svc.findByDelivery(deliveryId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
