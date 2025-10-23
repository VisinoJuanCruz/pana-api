import { Controller, Post, Get, Body } from '@nestjs/common';
import { DeliveryPersonsService } from './delivery-persons.service';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';

@Controller('delivery-persons')
export class DeliveryPersonsController {
  constructor(private readonly svc: DeliveryPersonsService) {}

  @Post()
  create(@Body() dto: CreateDeliveryPersonDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }
}
