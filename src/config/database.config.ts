import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
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
  migrationsRun: false, // Ejecutar manualmente
  autoLoadEntities: true,
  keepConnectionAlive: true,
};
