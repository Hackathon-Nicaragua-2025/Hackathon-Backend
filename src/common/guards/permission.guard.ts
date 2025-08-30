import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { User } from '../entities/app/user.entity';
import { UnauthorizedException } from '../exceptions/custom-exceptions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !this.hasPermissions(user, requiredPermissions)) {
      throw new UnauthorizedException('You do not have the necessary permissions.');
    }

    return true;
  }

  private hasPermissions(user: User, requiredPermissions: string[]): boolean {
    if (!user.roles || user.roles.length === 0) {
      this.logger.error('User does not have any roles assigned.');
      return false;
    }

    const userPermissions = user.roles.flatMap((role) => role.permissions.map((permission) => permission.name));
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
