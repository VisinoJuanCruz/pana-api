import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryStatus } from '@prisma/client';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly svc: DeliveriesService) {}

  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.svc.create(dto);
  }

  @Patch(':id/deliver')
  markAsDelivered(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amountPaid?: number; method?: string },
  ) {
    return this.svc.markAsDelivered(id, body.amountPaid, body.method);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('status') status?: string,
  ) {
    const skip = page ? (+page - 1) * +(perPage || 20) : undefined;
    const take = perPage ? +perPage : undefined;
    const statusEnum = status
      ? (DeliveryStatus[
          status as keyof typeof DeliveryStatus
        ] as DeliveryStatus)
      : undefined;
    return this.svc.findAll(skip, take, statusEnum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }
}
