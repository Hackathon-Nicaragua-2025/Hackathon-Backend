# 🚀 Configuración de Supabase para AviFy

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase Dashboard

1. **Ir a [supabase.com](https://supabase.com)**
2. **Iniciar sesión con tu cuenta de GitHub**
3. **Crear nuevo proyecto:**
   - Click en "New Project"
   - Seleccionar tu organización
   - Nombre: `avify-db` (o el que prefieras)
   - Contraseña de base de datos: Generar una segura
   - Región: La más cercana a Nicaragua (usualmente US East)
   - Click en "Create new project"

### 2. Obtener Credenciales de Conexión

Una vez creado el proyecto:

1. **Ir a Settings > Database**
2. **Copiar las credenciales:**
   - Host: `db.xxxxxxxxxxxxx.supabase.co`
   - Database name: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: La que configuraste

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DATABASE_HOST=db.xxxxxxxxxxxxx.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password_aqui

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# JWT Configuration
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# App Configuration
NODE_ENV=development
PORT=3000
```

### 4. Configurar TypeORM para PostgreSQL

Actualizar `src/config/database.config.ts`:

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // IMPORTANTE: false en producción
  logging: process.env.NODE_ENV === 'development',
  ssl: {
    rejectUnauthorized: false, // Para Supabase
  },
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: true,
};
```

## 🔧 Configuración de Migraciones

### 1. Instalar TypeORM CLI

```bash
npm install -g typeorm
npm install -g @nestjs/cli
```

### 2. Configurar TypeORM CLI

Crear `ormconfig.js` en la raíz:

```javascript
const { DataSource } = require('typeorm');
require('dotenv').config();

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  ssl: {
    rejectUnauthorized: false,
  },
});
```

### 3. Crear Estructura de Migraciones

```bash
mkdir -p src/database/migrations
```

### 4. Generar Migración Inicial

```bash
# Generar migración basada en las entidades
npx typeorm migration:generate src/database/migrations/InitialSchema -d ormconfig.js

# Ejecutar migración
npx typeorm migration:run -d ormconfig.js
```

## 🎯 Flujo de Trabajo Recomendado

### Desarrollo Local:
1. **Modificar entidades** en `src/common/entities/`
2. **Generar migración:** `npx typeorm migration:generate src/database/migrations/NombreMigracion`
3. **Revisar migración** generada
4. **Ejecutar migración:** `npx typeorm migration:run -d ormconfig.js`
5. **Probar cambios** localmente

### Despliegue:
1. **Commit y push** de migraciones
2. **Ejecutar migraciones** en Supabase
3. **Verificar** que todo funcione

## 🔒 Seguridad

### Variables de Entorno:
- **NUNCA** committear `.env` al repositorio
- Usar `.env.example` para documentar variables
- Configurar variables en Supabase Dashboard para producción

### Permisos de Base de Datos:
- Usar `postgres` user solo para migraciones
- Usar `anon` y `service_role` keys para la aplicación
- Configurar Row Level Security (RLS) en Supabase

## 📝 Comandos Útiles

```bash
# Generar migración
npx typeorm migration:generate src/database/migrations/NombreMigracion -d ormconfig.js

# Ejecutar migraciones
npx typeorm migration:run -d ormconfig.js

# Revertir última migración
npx typeorm migration:revert -d ormconfig.js

# Ver estado de migraciones
npx typeorm migration:show -d ormconfig.js

# Crear migración vacía
npx typeorm migration:create src/database/migrations/NombreMigracion
```

## 🚨 Notas Importantes

1. **Synchronize: false** - Nunca usar `synchronize: true` en producción
2. **SSL Configuration** - Necesario para Supabase
3. **Migrations** - Siempre usar migraciones para cambios de esquema
4. **Backup** - Supabase hace backups automáticos
5. **Monitoring** - Usar Supabase Dashboard para monitorear la base de datos
