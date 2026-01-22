import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserAuthInfoDto } from '../dto/user-auth-info.dto';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserAuthInfoDto | undefined => {
    const request = ctx.switchToHttp().getRequest<{
      user?: UserAuthInfoDto;
    }>();
    return request.user;
  },
);
