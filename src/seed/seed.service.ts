import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PermissionActions } from '../authentication/enums/authorization.enum';
import { Permission } from '../common/entities/app/permission.entity';
import { Module } from '../common/entities/app/module.entity';
import { Role } from '../common/entities/app/role.entity';
import { User } from '../common/entities/app/user.entity';
import { PasswordHasherService } from '../common/services/password-hasher.service';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async seedIfNeeded() {
    const adminUserExists = await this.userRepository.findOne({ where: { email: 'admin@perflog.com' } });
    if (!adminUserExists) {
      await this.seed();
    } else {
      console.log('Seeding not needed, admin user already exists.');
    }
  }

  async seed() {
    console.log('Starting seed...');

    // Step 1: Create Modules and Permissions
    const moduleNames = Object.keys(PermissionActions) as Array<keyof typeof PermissionActions>;

    for (const moduleName of moduleNames) {
      const existingModule = await this.moduleRepository.findOne({ where: { name: moduleName } });

      if (!existingModule) {
        const newModule = this.moduleRepository.create({ name: moduleName });
        const modulePermissions = Object.values(PermissionActions[moduleName]);

        const permissions = await Promise.all(
          modulePermissions.map(async (action) => {
            const existingPermission = await this.permissionRepository.findOne({ where: { action } });
            if (!existingPermission) {
              const permission = this.permissionRepository.create({ action });
              return this.permissionRepository.save(permission);
            }
            return existingPermission;
          }),
        );

        newModule.permissions = permissions;
        await this.moduleRepository.save(newModule);
      }
    }

    // Step 2: Create Roles
    await this.createAdminRole();
    await this.createManagerRole();
    await this.createSupervisorRole();
    await this.createViewerRole();
    await this.createBasicUserRole();

    // Step 3: Create an Admin User
    const adminUser = await this.userRepository.findOne({ where: { email: 'admin@perflog.com' } });
    if (!adminUser) {
      const password = 'adminPassword123';
      const adminRole = await this.roleRepository.findOne({ where: { name: 'Admin' } });
      const hashedPassword = await this.passwordHasher.hashPassword(password);

      if (!adminRole) {
        console.error('Admin role not found, cannot create admin user.');
        return;
      }
      const newUser = this.userRepository.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@perflog.com',
        password: hashedPassword,
        isActive: true,
        roles: [adminRole],
      });

      await this.userRepository.save(newUser);
    }

    console.log('Seed completed!');
  }

  // Create Admin Role with all permissions
  async createAdminRole() {
    const adminRole = await this.roleRepository.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      const allPermissions = await this.permissionRepository.find();
      const newAdminRole = this.roleRepository.create({
        name: 'Admin',
        permissions: allPermissions,
      });
      await this.roleRepository.save(newAdminRole);
      console.log('Admin role created with all permissions.');
    }
  }

  // Create Manager Role with full CRUD permissions, but no system-wide permissions
  async createManagerRole() {
    const managerRole = await this.roleRepository.findOne({ where: { name: 'Manager' } });
    if (!managerRole) {
      const managerPermissions = await this.permissionRepository.find({
        where: [
          { action: Like('%create') },
          { action: Like('%read') },
          { action: Like('%update') },
          { action: Like('%delete') },
        ],
      });
      const newManagerRole = this.roleRepository.create({
        name: 'Manager',
        permissions: managerPermissions,
      });
      await this.roleRepository.save(newManagerRole);
      console.log('Manager role created with CRUD permissions.');
    }
  }

  // Create Supervisor Role with mostly READ and UPDATE permissions, but no DELETE or CREATE
  async createSupervisorRole() {
    const supervisorRole = await this.roleRepository.findOne({ where: { name: 'Supervisor' } });
    if (!supervisorRole) {
      const supervisorPermissions = await this.permissionRepository.find({
        where: [{ action: Like('%read') }, { action: Like('%update') }],
      });
      const newSupervisorRole = this.roleRepository.create({
        name: 'Supervisor',
        permissions: supervisorPermissions,
      });
      await this.roleRepository.save(newSupervisorRole);
      console.log('Supervisor role created with READ and UPDATE permissions.');
    }
  }

  // Create Viewer Role with only READ permissions
  async createViewerRole() {
    const viewerRole = await this.roleRepository.findOne({ where: { name: 'Viewer' } });
    if (!viewerRole) {
      const viewerPermissions = await this.permissionRepository.find({
        where: { action: Like('%read') },
      });
      const newViewerRole = this.roleRepository.create({
        name: 'Viewer',
        permissions: viewerPermissions,
      });
      await this.roleRepository.save(newViewerRole);
      console.log('Viewer role created with READ-only permissions.');
    }
  }

  // Create Basic User Role with limited permissions (for example, basic data access)
  async createBasicUserRole() {
    const userRole = await this.roleRepository.findOne({ where: { name: 'User' } });
    if (!userRole) {
      const userPermissions = await this.permissionRepository.find({
        where: [
          { action: PermissionActions.AUDIT_LOG.READ },
          { action: PermissionActions.AUTHENTICATION.ME }, // Only has access to own user data
        ],
      });
      const newUserRole = this.roleRepository.create({
        name: 'User',
        permissions: userPermissions,
      });
      await this.roleRepository.save(newUserRole);
      console.log('User role created with limited permissions.');
    }
  }
}
