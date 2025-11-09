import { Module, forwardRef } from '@nestjs/common';
import { CashClosuresService } from './cash-closure.service';
import { CashClosuresController } from './cash-closure.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CashClosuresController],
  providers: [CashClosuresService, PrismaService],
  exports: [CashClosuresService],
})
export class CashClosureModule {}
