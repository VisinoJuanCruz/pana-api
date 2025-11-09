import { Module, forwardRef } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)], // ✅ da acceso a JwtService y AuthGuard
  controllers: [ReturnsController],
  providers: [ReturnsService, PrismaService],
  exports: [ReturnsService],
})
export class ReturnsModule {}
