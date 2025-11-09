import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecipe(dto: CreateRecipeDto) {
    if (!dto.ingredients?.length)
      throw new BadRequestException(
        'La receta debe tener al menos un ingrediente',
      );

    const rawMaterialIds = dto.ingredients.map((i) => i.rawMaterialId);
    const foundRawMaterials = await this.prisma.rawMaterial.findMany({
      where: { id: { in: rawMaterialIds } },
    });

    if (foundRawMaterials.length !== rawMaterialIds.length) {
      const missingIds = rawMaterialIds.filter(
        (id) => !foundRawMaterials.some((rm) => rm.id === id),
      );
      throw new NotFoundException(
        `Materias primas no encontradas: ${missingIds.join(', ')}`,
      );
    }

    return this.prisma.recipe.create({
      data: {
        name: dto.name,
        description: dto.description,
        ingredients: {
          create: dto.ingredients.map((it) => ({
            rawMaterialId: it.rawMaterialId,
            quantity: it.quantity,
          })),
        },
      },
      include: {
        ingredients: { include: { rawMaterial: true } },
      },
    });
  }

  async findAll(page = 1, perPage = 10, search?: string) {
    const where: Prisma.RecipeWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const skip = (page - 1) * perPage;

    const [total, data] = await Promise.all([
      this.prisma.recipe.count({ where }),
      this.prisma.recipe.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { name: 'asc' },
        include: { ingredients: { include: { rawMaterial: true } } },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: { include: { rawMaterial: true } } },
    });

    if (!recipe)
      throw new NotFoundException(`Receta con id ${id} no encontrada`);

    return recipe;
  }

  async update(id: number, dto: UpdateRecipeDto) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe)
      throw new NotFoundException(`Receta con id ${id} no encontrada`);

    return this.prisma.recipe.update({
      where: { id },
      data: {
        name: dto.name ?? recipe.name,
        description: dto.description ?? recipe.description,
        ingredients: dto.ingredients
          ? {
              deleteMany: {},
              create: dto.ingredients.map((it) => ({
                rawMaterialId: it.rawMaterialId,
                quantity: it.quantity,
              })),
            }
          : undefined,
      },
      include: { ingredients: { include: { rawMaterial: true } } },
    });
  }

  async partialUpdate(id: number, data: Prisma.RecipeUpdateInput) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe)
      throw new NotFoundException(`Receta con id ${id} no encontrada`);

    return this.prisma.recipe.update({
      where: { id },
      data,
      include: { ingredients: { include: { rawMaterial: true } } },
    });
  }

  async delete(id: number) {
    const exists = await this.prisma.recipe.findUnique({ where: { id } });
    if (!exists)
      throw new NotFoundException(`Receta con id ${id} no encontrada`);

    return this.prisma.recipe.delete({ where: { id } });
  }
}
