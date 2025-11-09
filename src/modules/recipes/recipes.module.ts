import { Module, forwardRef } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [RecipesController],
  providers: [RecipesService, PrismaService],
  exports: [RecipesService],
})
export class RecipesModule {}
