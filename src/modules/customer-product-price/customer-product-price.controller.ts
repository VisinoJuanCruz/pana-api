import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CustomerProductPriceService } from './customer-product-price.service';
import { CreateCustomerProductPriceDto } from './dto/create-customer-product-price.dto';
import { UpdateCustomerProductPriceDto } from './dto/update-customer-product-price.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('customer-product-prices')
export class CustomerProductPriceController {
  constructor(private svc: CustomerProductPriceService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
    @Query('customerId') customerId?: string,
    @Query('productId') productId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
  ) {
    return this.svc.findAll(+page, +perPage, {
      customerId: customerId ? +customerId : undefined,
      productId: productId ? +productId : undefined,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.svc.findByCustomer(customerId);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.svc.findByProduct(productId);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Post()
  create(@Body() dto: CreateCustomerProductPriceDto, @Req() req) {
    return this.svc.create(dto, req.user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Post('upsert')
  upsertSingle(@Body() dto: CreateCustomerProductPriceDto, @Req() req) {
    return this.svc.upsertSingle(dto, req.user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Post('bulk')
  bulkUpsert(@Body() dtos: CreateCustomerProductPriceDto[], @Req() req) {
    return this.svc.bulkUpsert(dtos, req.user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerProductPriceDto,
    @Req() req,
  ) {
    return this.svc.update(id, dto, req.user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.svc.delete(id, req.user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  @Delete('delete-by-pair')
  deleteByPair(
    @Body() body: { customerId: number; productId: number },
    @Req() req,
  ) {
    return this.svc.deleteByPair(body.customerId, body.productId, req.user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Delete('customer/:customerId')
  deleteByCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Req() req,
  ) {
    return this.svc.deleteByCustomer(customerId, req.user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Delete('product/:productId')
  deleteByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req,
  ) {
    return this.svc.deleteByProduct(productId, req.user);
  }

  @Roles(UserRole.ADMIN)
  @Delete('reset')
  resetAll(@Req() req) {
    return this.svc.resetAll(req.user);
  }
}
