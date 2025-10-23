import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductWithRecipeDto } from './dto/create-product-with-recipe.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Post('with-recipe')
  createWithRecipe(@Body() dto: CreateProductWithRecipeDto) {
    return this.productsService.createProductWithRecipe(dto);
  }

  @Patch(':productId/assign-recipe/:recipeId')
  assignRecipe(
    @Param('productId') productId: string,
    @Param('recipeId') recipeId: string,
  ) {
    return this.productsService.assignRecipeToProduct(+productId, +recipeId);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
