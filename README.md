# 🦅 AviFy - Plataforma de Aviturismo Nicaragua

Plataforma digital para promover el aviturismo y las reservas naturales de Nicaragua, facilitando la conexión entre turistas y guías locales certificados.

## 🎯 Descripción del Proyecto

**AviFy** es una plataforma desarrollada con **NestJS** y **TypeScript** que tiene como objetivo:

- **Promover áreas protegidas** de Nicaragua
- **Centralizar información de especies** de aves endémicas y migratorias
- **Gestionar reservas** de tours guiados
- **Facilitar la conexión** entre operadores locales y turistas nacionales e internacionales

## 🚀 Funcionalidades Principales

1. **Registro de usuarios** con diferentes roles (Turista, Guía, Admin)
2. **Catálogo digital de aves** con fotografías, descripciones y mapas de distribución
3. **Información de reservas naturales** habilitadas para aviturismo
4. **Calendario de temporadas** de avistamiento y eventos especiales
5. **Sistema de reservas en línea** para contratar guías certificados
6. **Módulo educativo** sobre conservación y buenas prácticas

## 🛠️ Tecnologías Utilizadas

- **Backend**: NestJS, TypeScript
- **Base de Datos**: SQL Server con TypeORM
- **Autenticación**: JWT, Passport.js
- **Autorización**: RBAC (Role-Based Access Control)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Logging**: Winston
- **Testing**: Jest

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- SQL Server
- npm o yarn

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Compilar el proyecto
npm run build
```

## 🚀 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Modo watch
npm run start
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📚 Documentación API

Una vez ejecutado el proyecto, la documentación Swagger estará disponible en:
- **Swagger UI**: http://localhost:3000/docs
- **Swagger YAML**: http://localhost:3000/swagger.yaml

## 🔐 Sistema de Autenticación y Autorización

### Roles del Sistema
- **Turista**: Usuario estándar con permisos básicos
- **Guía**: Guía verificado con permisos extendidos
- **Admin**: Administrador con acceso completo

### Endpoints de Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh-token` - Renovación de token
- `GET /auth/me` - Información del usuario actual
- `POST /auth/send-recovery-code` - Envío de código de recuperación
- `POST /auth/reset-password` - Restablecimiento de contraseña

## 🗄️ Estructura de Base de Datos

El proyecto utiliza un esquema modular con:
- **Esquema `app`**: Usuarios, roles, permisos y autenticación
- **Esquema `model`**: Entidades del dominio de aviturismo
- **Esquema `raw`**: Datos sin procesar
- **Esquema `config`**: Configuraciones del sistema

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Módulos de autenticación y autorización
│   ├── authentication/     # Login, registro, JWT
│   ├── authorization/      # Gestión de roles y permisos
│   └── audit-log/         # Auditoría del sistema
├── common/                # Utilidades compartidas
│   ├── entities/          # Entidades de base de datos
│   ├── guards/            # Guards de autorización
│   ├── decorators/        # Decoradores personalizados
│   └── services/          # Servicios comunes
├── config/                # Configuraciones del sistema
└── model/                 # Entidades del dominio
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para más información sobre el proyecto de aviturismo en Nicaragua, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para promover el aviturismo en Nicaragua**
