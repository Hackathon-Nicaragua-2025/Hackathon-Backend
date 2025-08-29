import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServerConfigurationModule } from './server-configuration/server-configuration.module';
import { configValidationSchema } from './common/utils/config.validation';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Module, MiddlewareConsumer, NestModule, OnModuleInit, Logger } from '@nestjs/common';
import { PermissionsGuard } from './common/guards/permission.guard';
import { QueryModule } from './query/query.module';
import { QueryRecommendationModule } from './query-recommendation/query-recommendation.module';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import { ServerMetricModule } from './server-metric/server-metric.module';
import { StatsPerIndexModule } from './stats-per-index/stats-per-index.module';
import { StatsPerTableModule } from './stats-per-table/stats-per-table.module';
import { TableModule } from './table/table.module';
import { TableRecommendationModule } from './table-recommendation/table-recommendation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexWeeklyPerformanceMetricModule } from './index_weekly_performance_metric/index_weekly_performance_metric.module';
import { QueryExecutionModule } from './query_execution/query_execution.module';
import { QueryWeeklyPerformanceMetricModule } from './query_weekly_performance_metric/query_weekly_performance_metric.module';
import { TableReviewModule } from './table_review/table_review.module';
import { TableWeeklyPerformanceMetricModule } from './table_weekly_performance_metric/table_weekly_performance_metric.module';
import { IndexModule } from './index/index.module';
import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { DatabaseConfigurationModule } from './database-configuration/database-configuration.module';
import { RecommendationListModule } from './recommendation-list/recommendation-list.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseInformationModule } from './database-information/database-information.module';
import { QueryParsedModule } from './query-parsed/query-parsed.module';
import { QueryReviewModule } from './query-review/query-review.module';
import { PerformanceRecommendationModule } from './performance-recommendation/performance-recommendation.module';
import { ServerDataRetentionModule } from './server-data-retention/server-data-retention.module';
import { ExecplanModule } from './execplan/execplan.module';
import { MissingIndexModule } from './missing-index/missing-index.module';
import { StoreProceduresModule } from './store-procedures/store-procedures.module';
import { CacheModule } from '@nestjs/cache-manager';

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
    ServerConfigurationModule,
    QueryModule,
    AuditLogModule,
    TableModule,
    QueryRecommendationModule,
    TableRecommendationModule,
    IndexWeeklyPerformanceMetricModule,
    QueryExecutionModule,
    QueryWeeklyPerformanceMetricModule,
    TableReviewModule,
    TableWeeklyPerformanceMetricModule,
    ServerMetricModule,
    StatsPerIndexModule,
    StatsPerTableModule,
    IndexModule,
    DomainModule,
    ApplicationModule,
    DatabaseConfigurationModule,
    RecommendationListModule,
    DatabaseModule,
    DatabaseInformationModule,
    QueryParsedModule,
    QueryReviewModule,
    PerformanceRecommendationModule,
    ServerDataRetentionModule,
    ExecplanModule,
    MissingIndexModule,
    StoreProceduresModule,
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
  constructor(private readonly seedService: SeedService) {} // Inject SeedService

  async onModuleInit() {
    await this.seedService.seedIfNeeded(); // Perform seeding logic on application startup
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*'); // Apply middleware globally
  }
}
