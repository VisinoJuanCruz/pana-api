import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportRangeDto } from './dto/report-range.dto';

@Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get('sales-summary')
  salesSummary(@Query() q: ReportRangeDto) {
    return this.svc.salesSummary(q.from, q.to);
  }

  @Get('payments-summary')
  paymentsSummary(@Query() q: ReportRangeDto) {
    return this.svc.paymentsSummary(q.from, q.to);
  }

  @Get('top-products')
  topProducts(@Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit = '10') {
    return this.svc.topProducts(from, to, +limit);
  }

  @Get('returns-summary')
  returnsSummary(@Query() q: ReportRangeDto) {
    return this.svc.returnsSummary(q.from, q.to);
  }

  @Get('top-returning-customers')
  topReturningCustomers(@Query() q: ReportRangeDto) {
    return this.svc.topReturningCustomers(q.from, q.to);
  }
}
