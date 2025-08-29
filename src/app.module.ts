import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './common/utils/config.validation';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Module, MiddlewareConsumer, NestModule, OnModuleInit, Logger } from '@nestjs/common';
import { PermissionsGuard } from './common/guards/permission.guard';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: 'memory',
      ttl: 300,
      max: 100,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsedConfig = configValidationSchema.safeParse(config);
        if (!parsedConfig.success) {
          Logger.error('Configuration validation error:', parsedConfig.error.format());
          throw new Error('Invalid configuration for environment variables' + parsedConfig.error.message);
        }
        return parsedConfig.data;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        await ConfigModule.envVariablesLoaded;
        return {
          type: 'mssql',
          retryAttempts: 1,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
          logging: configService.get<boolean>('DB_LOGGING'),
          entities: [__dirname + '/common/entities/**/*.entity{.ts,.js}'],
        };
      },
    }),
    SeedModule,
    AuthenticationModule,
    AuthorizationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.seedIfNeeded();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
