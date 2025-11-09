import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('recipes')
@UseGuards(AuthGuard, RolesGuard)
export class RecipesController {
  constructor(private readonly svc: RecipesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateRecipeDto) {
    return this.svc.createRecipe(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '10',
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const perPageNum = parseInt(perPage, 10);
    return this.svc.findAll(pageNum, perPageNum, search);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecipeDto) {
    return this.svc.update(id, dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<UpdateRecipeDto>,
  ) {
    const { ingredients, ...rest } = data;
    return this.svc.partialUpdate(id, rest);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.delete(id);
  }
}
