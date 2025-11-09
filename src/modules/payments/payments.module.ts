import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerBalancesModule } from '../customer-balances/customer-balances.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CustomerBalancesModule, forwardRef(() => AuthModule)],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
