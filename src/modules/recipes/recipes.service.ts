import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  // Crea una receta (usa la propiedad 'ingredients' en el DTO)
  async createRecipe(dto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        name: dto.name,
        description: dto.description,
        // NOTE: en schema el campo de relación se llama 'ingredients'
        ingredients: {
          create: dto.ingredients.map((it) => ({
            rawMaterialId: it.rawMaterialId,
            quantity: it.quantity,
          })),
        },
      },
      include: {
        // incluir ingredients (no items)
        ingredients: { include: { rawMaterial: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.recipe.findMany({
      include: { ingredients: { include: { rawMaterial: true } } },
    });
  }

  async findOne(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: { include: { rawMaterial: true } } },
    });
    if (!recipe) throw new NotFoundException('Receta no encontrada');
    return recipe;
  }

  async delete(id: number) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
