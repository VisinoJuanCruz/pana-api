import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DeliveryPersonsService } from './delivery-persons.service';
import { DeliveryPersonsController } from './delivery-persons.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryPersonsController],
  providers: [DeliveryPersonsService],
})
export class DeliveryPersonsModule {}
