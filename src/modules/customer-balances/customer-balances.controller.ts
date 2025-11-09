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
  UseGuards,
  Req,
} from '@nestjs/common';
import { CustomerBalancesService } from './customer-balances.service';
import { CreateCustomerBalanceDto } from './dto/create-customer-balance.dto';
import { UpdateCustomerBalanceDto } from './dto/update-customer-balance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('customer-balances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerBalancesController {
  constructor(private readonly svc: CustomerBalancesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  create(@Body() dto: CreateCustomerBalanceDto, @Req() req) {
    return this.svc.create(dto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(
    @Query('customerId') customerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: 'CREDIT' | 'DEBIT',
    @Req() req?,
  ) {
    return this.svc.findAll(
      {
        customerId: customerId ? +customerId : undefined,
        from,
        to,
        type,
      },
      req.user,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.svc.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerBalanceDto,
    @Req() req,
  ) {
    return this.svc.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.svc.delete(id, req.user);
  }
}
