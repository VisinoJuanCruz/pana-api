import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, PrismaService],
  exports: [RecipesService], // 👈 ¡Esto es clave!
})
export class RecipesModule {}
