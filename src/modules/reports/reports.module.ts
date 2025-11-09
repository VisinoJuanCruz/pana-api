import { Module, forwardRef } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [forwardRef(() => AuthModule)], // acceso a JwtService
  providers: [ReportsService, PrismaService],
  controllers: [ReportsController],
})
export class ReportsModule {}
