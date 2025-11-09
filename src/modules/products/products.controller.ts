import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductWithRecipeDto } from './dto/create-product-with-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Solo ADMIN puede crear productos
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  // Solo ADMIN puede crear producto + receta
  @Post('with-recipe')
  @Roles(UserRole.ADMIN)
  createWithRecipe(@Body() dto: CreateProductWithRecipeDto) {
    return this.productsService.createProductWithRecipe(dto);
  }

  // Solo ADMIN puede asignar recetas
  @Patch(':productId/assign-recipe/:recipeId')
  @Roles(UserRole.ADMIN)
  assignRecipe(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    return this.productsService.assignRecipeToProduct(productId, recipeId);
  }

  // ADMIN y EMPLOYEE pueden ver productos
  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(
      page ? Number(page) : undefined,
      perPage ? Number(perPage) : undefined,
      search,
    );
  }

  // ADMIN y EMPLOYEE pueden ver un producto
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}
