import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { UserAuthInfoDto } from '../dto/user-auth-info.dto';

@Injectable()
export class UserJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(UserJwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: UserAuthInfoDto;
      authToken?: string;
    }>();
    const token = this.extractTokenFromHeader(request);

    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug('Skipping auth in non-production environment');
      const devUser: UserAuthInfoDto = {
        groups: ['Gauss Labs'],
        roles: ['VM Admin'],
        user_id: 'dev-user',
      };
      request.user = devUser;
      request.authToken = 'dev-token';
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('No bearer token provided');
    }

    try {
      // Example
      const data = {
        user_id: 'validated-user',
        groups: ['Gauss Labs'],
        roles: ['VM Admin'],
      };
      request.user = data;
      request.authToken = token;
      return true;
    } catch (error) {
      this.logger.warn('Token validation failed', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: {
    headers: Record<string, string | undefined>;
    user?: UserAuthInfoDto;
    authToken?: string;
  }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
