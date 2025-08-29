import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../common/entities/app/permission.entity';
import { Role } from '../common/entities/app/role.entity';
import { NotFoundException } from '../common/exceptions/custom-exceptions';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getListRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async getListPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async getPermissionsForRole(roleId: number): Promise<Permission[]> {
    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role.permissions;
  }
}
