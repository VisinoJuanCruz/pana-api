import { Module, forwardRef } from '@nestjs/common';
import { CustomerBalancesService } from './customer-balances.service';
import { CustomerBalancesController } from './customer-balances.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CustomerBalancesController],
  providers: [CustomerBalancesService, PrismaService],
  exports: [CustomerBalancesService],
})
export class CustomerBalancesModule {}
