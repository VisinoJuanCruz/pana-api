import { Module, forwardRef } from '@nestjs/common';
import { CustomerProductPriceService } from './customer-product-price.service';
import { CustomerProductPriceController } from './customer-product-price.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CustomerProductPriceController],
  providers: [CustomerProductPriceService, PrismaService],
  exports: [CustomerProductPriceService],
})
export class CustomerProductPriceModule {}
