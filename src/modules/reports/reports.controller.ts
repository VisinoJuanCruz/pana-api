// src/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportRangeDto } from './dto/report-range.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(AuthGuard, RolesGuard)
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get('sales-summary')
  @Roles(UserRole.ADMIN)
  salesSummary(@Query() q: ReportRangeDto) {
    return this.svc.salesSummary(q.from, q.to);
  }

  @Get('payments-summary')
  @Roles(UserRole.ADMIN)
  paymentsSummary(@Query() q: ReportRangeDto) {
    return this.svc.paymentsSummary(q.from, q.to);
  }

  @Get('top-products')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  topProducts(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit = '10',
  ) {
    return this.svc.topProducts(from, to, +limit);
  }

  @Get('returns-summary')
  @Roles(UserRole.ADMIN)
  returnsSummary(@Query() q: ReportRangeDto) {
    return this.svc.returnsSummary(q.from, q.to);
  }

  @Get('top-returning-customers')
  @Roles(UserRole.ADMIN)
  topReturningCustomers(@Query() q: ReportRangeDto) {
    return this.svc.topReturningCustomers(q.from, q.to);
  }
}
