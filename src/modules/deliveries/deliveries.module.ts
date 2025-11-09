import { Module, forwardRef } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsModule } from '../payments/payments.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PaymentsModule, forwardRef(() => AuthModule)],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, PrismaService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
