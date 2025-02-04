import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/services/user.service';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public.decorator';
import { ROLES_KEY } from '../../../shared/decorators/roles.decorator';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = this.getRequest<IncomingMessage & { user?: User }>(context);

    try {
      // Authenticate the user
      const user = await this.authenticateUser(request);
      request.user = user;

      // Authorize the user (Role-based access control)
      return this.authorizeUser(user, context);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extracts and verifies the JWT, then fetches the user from the database.
   */
  private async authenticateUser(
    request: IncomingMessage & { user?: User },
  ): Promise<User> {
    const token = this.getToken(request);
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const userId = payload.sub;
    const user: User | null = await this.userService.findOne({ id: userId });

    if (!user) throw new UnauthorizedException('Invalid token: User not found');

    user.password = '';
    return user;
  }

  /**
   * Checks if the user has the required roles to access the route.
   */
  private authorizeUser(user: User, context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const hasRole = requiredRoles.some((role) =>
      user.role?.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true;
  }

  private getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  private getToken(request: IncomingMessage & { user?: User }): string {
    const authorization = request.headers['authorization'];

    if (!authorization || authorization.trim() === '' || Array.isArray(authorization)) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const [_, token] = authorization.split(' ');
    return token;
  }
}
