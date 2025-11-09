import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { InventoryModule } from './modules/inventory/inventory.module';
import { CustomerBalancesModule } from './modules/customer-balances/customer-balances.module';
import { CashClosureModule } from './modules/cash-closure/cash-closure.module';
import { CustomerProductPriceModule } from './modules/customer-product-price/customer-product-price.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
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
    InventoryModule,
    CustomerBalancesModule,
    CashClosureModule,
    CustomerProductPriceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Autenticación global
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Roles globales
    },
  ],
})
export class AppModule {}
