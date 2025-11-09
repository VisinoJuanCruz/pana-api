// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('El email ya está en uso');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
      role: dto.role || UserRole.EMPLOYEE,
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return this.generateTokens(user);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) throw new UnauthorizedException('Contraseña actual incorrecta');

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updateUser(user.id, { password: newHash });
    return { message: 'Contraseña actualizada con éxito' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updateUser(user.id, { password: newHash });
    return { message: 'Contraseña restablecida con éxito' };
  }

  async refreshTokens(userId: number, email: string, role: UserRole) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    return this.generateTokens({ id: userId, email, role });
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
