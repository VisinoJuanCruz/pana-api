import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Solo admin
  @Get()
  @Roles(UserRole.ADMIN)
  getAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(Number(page), Number(perPage), search);
  }

  // Admin y employee pueden ver su propio perfil
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  // Solo admin puede crear usuarios
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  // Solo admin puede editar
  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  // Solo admin puede eliminar
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeUser(id);
  }
}
