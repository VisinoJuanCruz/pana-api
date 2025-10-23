import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './modules/customers/customers.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RawMaterialsModule } from './modules/raw-materials/raw-materials.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { DeliveryPersonsModule } from './modules/delivery-persons/delivery-persons.module';

@Module({
  imports: [
    CustomersModule,
    ProductsModule,
    OrdersModule,
    DeliveriesModule,
    PaymentsModule,
    ReturnsModule,
    ReportsModule,
    PrismaModule,
    RawMaterialsModule,
    RecipesModule,
    DeliveryPersonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
