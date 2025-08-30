import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../common/entities/app/user.entity';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { UnauthorizedException } from '../../common/exceptions/custom-exceptions';

@Injectable()
export class PermissionsGuard implements CanActivate {
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
    const userPermissions = user.roles.flatMap((role) => role.permissions.map((permission) => permission.name));
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
