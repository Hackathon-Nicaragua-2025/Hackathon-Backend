import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionActions } from '../authentication/enums/avify-permissions.enum';
import { Permission } from '../common/entities/app/permission.entity';
import { Role } from '../common/entities/app/role.entity';
import { User } from '../common/entities/app/user.entity';
import { PasswordHasherService } from '../common/services/password-hasher.service';

@Injectable()
export class SeedService {
  private readonly adminEmail = 'admin@avify.com';
  private readonly adminPassword = 'AdminPassword123!';

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async seed() {
    console.log('🌱 Iniciando proceso de seed...');

    await this.createPermissions();
    await this.createRoles();

    const adminUserExists = await this.userRepository.findOne({ where: { email: this.adminEmail } });
    if (!adminUserExists) {
      await this.createAdminUser();
    }

    console.log('✅ Seeding completado exitosamente!');
  }

  private async createPermissions() {
    const existingPermissions = new Map(
      (await this.permissionRepository.find()).map((permission) => [permission.name, permission]),
    );

    const moduleNames = Object.keys(PermissionActions) as Array<keyof typeof PermissionActions>;

    for (const moduleName of moduleNames) {
      const modulePermissions = Object.values(PermissionActions[moduleName]);

      for (const permissionName of modulePermissions) {
        let permission = existingPermissions.get(permissionName);

        if (!permission) {
          // Crear permiso si no existe
          permission = this.permissionRepository.create({
            name: permissionName,
            description: `Permiso para ${permissionName.replace('_', ' ')}`,
          });
          permission = await this.permissionRepository.save(permission);
          existingPermissions.set(permissionName, permission);
        }
      }
    }

    // Asignar todos los permisos al rol Admin
    await this.assignPermissionsToAdmin(Array.from(existingPermissions.values()));
  }

  private async createRoles() {
    // Crear rol Turista
    await this.createTuristaRole();

    // Crear rol Guía
    await this.createGuiaRole();

    // Crear rol Admin (ya se crea en assignPermissionsToAdmin)
  }

  private async assignPermissionsToAdmin(allPermissions: Permission[]) {
    // Buscar el rol Admin y sus permisos existentes
    let adminRole = await this.roleRepository.findOne({
      where: { name: 'Admin' },
      relations: ['permissions'],
    });

    if (!adminRole) {
      // Crear rol Admin si no existe
      adminRole = this.roleRepository.create({
        name: 'Admin',
        description: 'Administrador del sistema',
        isSystem: true,
        permissions: allPermissions,
      });
    } else {
      // Agregar solo nuevos permisos al rol Admin existente
      const existingPermissions = new Set(adminRole.permissions.map((p) => p.permissionId));
      const newPermissions = allPermissions.filter((p) => !existingPermissions.has(p.permissionId));
      if (newPermissions.length > 0) {
        adminRole.permissions = [...adminRole.permissions, ...newPermissions];
      }
    }

    // Guardar rol Admin actualizado
    await this.roleRepository.save(adminRole);
    console.log('Rol Admin actualizado con nuevos permisos.');
  }

  private async createTuristaRole() {
    const turistaRole = await this.roleRepository.findOne({ where: { name: 'Turista' } });
    if (!turistaRole) {
      const turistaPermissions = await this.permissionRepository.find({
        where: [
          { name: PermissionActions.BOOKINGS.CREATE },
          { name: PermissionActions.BOOKINGS.READ },
          { name: PermissionActions.SIGHTINGS.CREATE },
          { name: PermissionActions.SIGHTINGS.READ },
          { name: PermissionActions.BIRD_CATALOG.READ },
          { name: PermissionActions.RESERVES.READ },
          { name: PermissionActions.EVENTS.READ },
          { name: PermissionActions.EDUCATIONAL.READ },
          { name: PermissionActions.AUTHENTICATION.ME },
        ],
      });

      const newTuristaRole = this.roleRepository.create({
        name: 'Turista',
        description: 'Usuario registrado estándar',
        isSystem: true,
        permissions: turistaPermissions,
      });
      await this.roleRepository.save(newTuristaRole);
      console.log('Rol Turista creado con permisos básicos.');
    }
  }

  private async createGuiaRole() {
    const guiaRole = await this.roleRepository.findOne({ where: { name: 'Guia' } });
    if (!guiaRole) {
      const guiaPermissions = await this.permissionRepository.find({
        where: [
          { name: PermissionActions.GUIDES.MANAGE },
          { name: PermissionActions.BOOKINGS.READ },
          { name: PermissionActions.BOOKINGS.MANAGE },
          { name: PermissionActions.SIGHTINGS.CREATE },
          { name: PermissionActions.SIGHTINGS.MANAGE },
          { name: PermissionActions.BIRD_CATALOG.READ },
          { name: PermissionActions.RESERVES.READ },
          { name: PermissionActions.EVENTS.READ },
          { name: PermissionActions.EDUCATIONAL.READ },
          { name: PermissionActions.AUTHENTICATION.ME },
        ],
      });

      const newGuiaRole = this.roleRepository.create({
        name: 'Guia',
        description: 'Guía verificado',
        isSystem: true,
        permissions: guiaPermissions,
      });
      await this.roleRepository.save(newGuiaRole);
      console.log('Rol Guía creado con permisos extendidos.');
    }
  }

  private async createAdminUser() {
    // Buscar el rol Admin
    const adminRole = await this.roleRepository.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      console.error('Rol Admin no encontrado, no se puede crear el usuario administrador.');
      return;
    }

    // Hashear contraseña de admin y crear usuario admin
    const hashedPassword = await this.passwordHasher.hashPassword(this.adminPassword);
    const newUser = this.userRepository.create({
      nombre: 'Administrador',
      email: this.adminEmail,
      emailNormalized: this.adminEmail.toLowerCase(),
      passwordHash: hashedPassword,
      isActive: true,
      isVerified: true,
      roles: [adminRole],
    });

    await this.userRepository.save(newUser);
    console.log('Usuario administrador creado.');
    console.log(`Email: ${this.adminEmail}`);
    console.log(`Contraseña: ${this.adminPassword}`);
  }
}
