import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DeliveryPersonsService } from './delivery-persons.service';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('delivery-persons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveryPersonsController {
  constructor(private readonly svc: DeliveryPersonsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateDeliveryPersonDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateDeliveryPersonDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: string) {
    return this.svc.delete(+id);
  }
}
