import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { Permission } from '../common/entities/app/permission.entity';
import { Role } from '../common/entities/app/role.entity';
import { AuthorizationService } from './authorization.service';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponseWithData(Role, 'Successfully retrieved roles', 200)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('roles')
  async getListRoles() {
    const result = this.authorizationService.getListRoles();
    return ApiResponseDto.Success(result, 'Get Roles', 'Roles retrieved successfully.');
  }

  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponseWithData(Permission, 'Successfully retrieved permissions', 200)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('permissions')
  async getListPermissions() {
    const result = this.authorizationService.getListPermissions();
    return ApiResponseDto.Success(result, 'Get Permissions', 'Permissions retrieved successfully.');
  }

  @ApiOperation({ summary: 'Get permissions for a specific role' })
  @ApiResponseWithData(Permission, 'Successfully retrieved role permissions', 200)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('roles/:roleId/permissions')
  async GetListRolePermissions(@Param('roleId') roleId: number) {
    const result = this.authorizationService.getPermissionsForRole(roleId);
    return ApiResponseDto.Success(result, 'Get Role Permissions', 'Role permissions retrieved successfully for role.');
  }
}
