import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductWithRecipeDto } from './dto/create-product-with-recipe.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private recipesService: RecipesService,
  ) {}

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async createProductWithRecipe(dto: CreateProductWithRecipeDto) {
    const recipe = dto.recipe
      ? await this.recipesService.createRecipe({
          name: dto.recipe.name,
          description: dto.recipe.description,
          ingredients: dto.recipe.ingredients,
        })
      : null;

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        basePrice: dto.basePrice,
        recipeId: recipe ? recipe.id : undefined,
      },
      include: {
        recipe: {
          include: { ingredients: { include: { rawMaterial: true } } },
        },
      },
    });
  }

  async assignRecipeToProduct(productId: number, recipeId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!product) throw new NotFoundException('Producto no encontrado');
    if (!recipe) throw new NotFoundException('Receta no encontrada');

    return this.prisma.product.update({
      where: { id: productId },
      data: { recipeId },
      include: {
        recipe: {
          include: { ingredients: { include: { rawMaterial: true } } },
        },
      },
    });
  }

  async findAll(page = 1, perPage = 10, search?: string) {
    if (page < 1) page = 1;
    if (perPage < 1) perPage = 10;

    const skip = (page - 1) * perPage;
    const take = perPage;

    const where: Prisma.ProductWhereInput | undefined = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : undefined;

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          recipe: {
            include: { ingredients: { include: { rawMaterial: true } } },
          },
        },
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        recipe: {
          include: { ingredients: { include: { rawMaterial: true } } },
        },
      },
    });

    if (!product)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return product;
  }
}
