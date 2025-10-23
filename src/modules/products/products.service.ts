import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductWithRecipeDto } from './dto/create-product-with-recipe.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private recipesService: RecipesService,
  ) {}

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  // Crea receta delegando en RecipesService y luego crea el producto
  async createProductWithRecipe(dto: CreateProductWithRecipeDto) {
    // Si viene recipe, usar RecipesService (espera ingredients)
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
        // incluir receta bajo el nombre actual 'ingredients'
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

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        recipe: {
          include: { ingredients: { include: { rawMaterial: true } } },
        },
      },
    });
  }
}
