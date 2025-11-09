import { Module, forwardRef } from '@nestjs/common';
import { ReturnItemsService } from './return-items.service';
import { ReturnItemsController } from './return-items.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)], // ✅ acceso a JwtService y AuthGuard
  controllers: [ReturnItemsController],
  providers: [ReturnItemsService, PrismaService],
  exports: [ReturnItemsService],
})
export class ReturnItemsModule {}
