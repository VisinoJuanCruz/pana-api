import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

/**
 * Decorador para obtener el usuario actual autenticado desde el request.
 * Usa los datos del JWT que se cargan en req.user por el JwtStrategy.
 *
 * Ejemplo:
 *   getProfile(@CurrentUser() user)
 *   getProfile(@CurrentUser('email') email)
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
