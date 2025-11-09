import { Module, forwardRef } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { RawMaterialsController } from './raw-materials.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [RawMaterialsController],
  providers: [RawMaterialsService, PrismaService],
})
export class RawMaterialsModule {}
