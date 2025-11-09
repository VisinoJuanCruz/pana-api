import { Module, forwardRef } from '@nestjs/common';
import { DeliveryPersonsService } from './delivery-persons.service';
import { DeliveryPersonsController } from './delivery-persons.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [DeliveryPersonsController],
  providers: [DeliveryPersonsService, PrismaService],
  exports: [DeliveryPersonsService],
})
export class DeliveryPersonsModule {}
