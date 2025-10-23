import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  create(@Body() data: CreateReturnDto) {
    return this.returnsService.create(data);
  }

  @Get()
  findAll() {
    return this.returnsService.findAll();
  }

  @Get('customer/:id')
  findByCustomer(@Param('id') id: string) {
    return this.returnsService.findByCustomer(Number(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateReturnDto) {
    return this.returnsService.update(Number(id), data);
  }

  @Patch(':id/assign/:deliveryPersonId')
  assignDeliveryPerson(
    @Param('id') id: string,
    @Param('deliveryPersonId') deliveryPersonId: string,
  ) {
    return this.returnsService.assignDeliveryPerson(
      Number(id),
      Number(deliveryPersonId),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returnsService.delete(Number(id));
  }
}
