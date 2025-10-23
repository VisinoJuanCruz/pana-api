import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesModule } from '../recipes/recipes.module'; // 👈 Importamos esto

@Module({
  imports: [RecipesModule], // 👈 ¡Esto es lo que faltaba!
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
