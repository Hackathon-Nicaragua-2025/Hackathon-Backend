import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../common/entities/app/role.entity';
import { Permission } from '../common/entities/app/permission.entity';
import { NotFoundException } from '../common/exceptions/custom-exceptions';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Permission),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepository = module.get<Repository<Permission>>(getRepositoryToken(Permission));
  });

  describe('getListRoles', () => {
    it('should return all roles', async () => {
      const roles: Role[] = [{ id: 1, name: 'Admin', permissions: [] } as unknown as Role];
      jest.spyOn(roleRepository, 'find').mockResolvedValue(roles);

      const result = await service.getListRoles();

      expect(result).toEqual(roles);
      expect(roleRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListPermissions', () => {
    it('should return all permissions', async () => {
      const permissions: Permission[] = [{ id: 1, action: 'READ', modules: [], roles: [] } as Permission];
      jest.spyOn(permissionRepository, 'find').mockResolvedValue(permissions);

      const result = await service.getListPermissions();

      expect(result).toEqual(permissions);
      expect(permissionRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPermissionsForRole', () => {
    it('should return permissions for a specific role', async () => {
      const permissions: Permission[] = [{ id: 1, action: 'READ', modules: [], roles: [] } as Permission];
      const role: Role = { id: 1, name: 'Admin', permissions, users: [] } as Role;
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(role);

      const result = await service.getPermissionsForRole(1);

      expect(result).toEqual(permissions);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['permissions'],
      });
    });

    it('should throw NotFoundException if role is not found', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getPermissionsForRole(1)).rejects.toThrow(new NotFoundException('Role not found'));
    });
  });
});
