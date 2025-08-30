import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1756495000000 implements MigrationInterface {
  name = 'InitialSchema1756495000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear esquema y extensión
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "app"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 2. Crear tablas de autenticación primero
    await queryRunner.query(`
      CREATE TABLE "app"."Users" (
        "UserId" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "Nombre" character varying(200) NOT NULL,
        "Email" character varying(200) NOT NULL,
        "EmailNormalized" character varying(200) NOT NULL,
        "PasswordHash" character varying(500),
        "Phone" character varying(50),
        "AvatarUrl" character varying,
        "IsVerified" boolean NOT NULL DEFAULT false,
        "IsActive" boolean NOT NULL DEFAULT true,
        "FailedLoginCount" integer NOT NULL DEFAULT '0',
        "LockoutUntil" TIMESTAMP WITH TIME ZONE,
        "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "LastLoginAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_Users" PRIMARY KEY ("UserId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "app"."Roles" (
        "RoleId" SERIAL NOT NULL,
        "Name" character varying(50) NOT NULL,
        "Description" character varying(250),
        "IsSystem" boolean NOT NULL DEFAULT false,
        "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_Roles" PRIMARY KEY ("RoleId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "app"."Permissions" (
        "PermissionId" SERIAL NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Description" character varying(250),
        CONSTRAINT "PK_Permissions" PRIMARY KEY ("PermissionId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "app"."RefreshTokens" (
        "RefreshTokenId" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "UserId" uuid NOT NULL,
        "TokenHash" character varying(500) NOT NULL,
        "ExpiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "RevokedAt" TIMESTAMP WITH TIME ZONE,
        "ReplacedByToken" uuid,
        CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("RefreshTokenId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "app"."VerificationTokens" (
        "VerificationId" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "UserId" uuid NOT NULL,
        "TokenHash" character varying(500) NOT NULL,
        "Purpose" character varying(50) NOT NULL,
        "ExpiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "UsedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_VerificationTokens" PRIMARY KEY ("VerificationId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "app"."LoginAudits" (
        "AuditId" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "UserId" uuid,
        "Event" character varying(100) NOT NULL,
        "IpAddress" character varying(100),
        "UserAgent" character varying(500),
        "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_LoginAudits" PRIMARY KEY ("AuditId")
      )
    `);

    // 3. Crear tablas de relación
    await queryRunner.query(`
      CREATE TABLE "app"."UserRoles" (
        "UserId" uuid NOT NULL,
        "RoleId" integer NOT NULL,
        CONSTRAINT "PK_UserRoles" PRIMARY KEY ("UserId", "RoleId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "app"."RolePermissions" (
        "RoleId" integer NOT NULL,
        "PermissionId" integer NOT NULL,
        CONSTRAINT "PK_RolePermissions" PRIMARY KEY ("RoleId", "PermissionId")
      )
    `);

    // 4. Agregar foreign keys básicas
    await queryRunner.query(`
      ALTER TABLE "app"."RefreshTokens" 
      ADD CONSTRAINT "FK_RefreshTokens_User" 
      FOREIGN KEY ("UserId") REFERENCES "app"."Users"("UserId") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "app"."VerificationTokens" 
      ADD CONSTRAINT "FK_VerificationTokens_User" 
      FOREIGN KEY ("UserId") REFERENCES "app"."Users"("UserId") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "app"."LoginAudits" 
      ADD CONSTRAINT "FK_LoginAudits_User" 
      FOREIGN KEY ("UserId") REFERENCES "app"."Users"("UserId") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "app"."UserRoles" 
      ADD CONSTRAINT "FK_UserRoles_User" 
      FOREIGN KEY ("UserId") REFERENCES "app"."Users"("UserId") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "app"."UserRoles" 
      ADD CONSTRAINT "FK_UserRoles_Role" 
      FOREIGN KEY ("RoleId") REFERENCES "app"."Roles"("RoleId") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "app"."RolePermissions" 
      ADD CONSTRAINT "FK_RolePermissions_Role" 
      FOREIGN KEY ("RoleId") REFERENCES "app"."Roles"("RoleId") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "app"."RolePermissions" 
      ADD CONSTRAINT "FK_RolePermissions_Permission" 
      FOREIGN KEY ("PermissionId") REFERENCES "app"."Permissions"("PermissionId") ON DELETE CASCADE
    `);

    // 5. Crear índices básicos
    await queryRunner.query(`CREATE INDEX "IX_Users_Email" ON "app"."Users" ("Email")`);
    await queryRunner.query(`CREATE INDEX "IX_Users_EmailNormalized" ON "app"."Users" ("EmailNormalized")`);
    await queryRunner.query(`CREATE INDEX "IX_Roles_Name" ON "app"."Roles" ("Name")`);
    await queryRunner.query(`CREATE INDEX "IX_Permissions_Name" ON "app"."Permissions" ("Name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys
    await queryRunner.query(`ALTER TABLE "app"."RolePermissions" DROP CONSTRAINT "FK_RolePermissions_Permission"`);
    await queryRunner.query(`ALTER TABLE "app"."RolePermissions" DROP CONSTRAINT "FK_RolePermissions_Role"`);
    await queryRunner.query(`ALTER TABLE "app"."UserRoles" DROP CONSTRAINT "FK_UserRoles_Role"`);
    await queryRunner.query(`ALTER TABLE "app"."UserRoles" DROP CONSTRAINT "FK_UserRoles_User"`);
    await queryRunner.query(`ALTER TABLE "app"."LoginAudits" DROP CONSTRAINT "FK_LoginAudits_User"`);
    await queryRunner.query(`ALTER TABLE "app"."VerificationTokens" DROP CONSTRAINT "FK_VerificationTokens_User"`);
    await queryRunner.query(`ALTER TABLE "app"."RefreshTokens" DROP CONSTRAINT "FK_RefreshTokens_User"`);

    // Eliminar tablas
    await queryRunner.query(`DROP TABLE "app"."RolePermissions"`);
    await queryRunner.query(`DROP TABLE "app"."UserRoles"`);
    await queryRunner.query(`DROP TABLE "app"."LoginAudits"`);
    await queryRunner.query(`DROP TABLE "app"."VerificationTokens"`);
    await queryRunner.query(`DROP TABLE "app"."RefreshTokens"`);
    await queryRunner.query(`DROP TABLE "app"."Permissions"`);
    await queryRunner.query(`DROP TABLE "app"."Roles"`);
    await queryRunner.query(`DROP TABLE "app"."Users"`);

    // Eliminar esquema
    await queryRunner.query(`DROP SCHEMA "app"`);
  }
}
