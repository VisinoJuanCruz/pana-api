import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesModule } from '../recipes/recipes.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RecipesModule, forwardRef(() => AuthModule)],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
