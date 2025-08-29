import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ServerConfiguration } from '../entities/config/server-configuration.entity';
import { CacheService } from './cache.service';

const queries: Record<string, string> = {
  postgres: `SELECT datname AS database_name FROM pg_database WHERE datistemplate = false;`,
  mysql: `SHOW DATABASES;`,
  mariadb: `SHOW DATABASES;`,
  sqlite: '',
  mssql: `SELECT name AS database_name FROM sys.databases WHERE state = 0;`,
};

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);
  private readonly connectionPools: Record<string, DataSource> = {};

  constructor(private readonly cacheService: CacheService) {}

  async getListDatabaseByServerConfiguration(config: ServerConfiguration): Promise<string[]> {
    if (!config.isEnabled) throw new BadRequestException('Server configuration is disabled.');
    if (!config.driver || !config.ipAddress || !config.user) {
      throw new BadRequestException('Invalid server configuration, missing required fields: driver, ipAddress, user.');
    }

    const cacheKey = `test-db-connection-${config.id}`;
    const cachedResult = await this.cacheService.get<string[]>(cacheKey);
    if (cachedResult) {
      this.logger.log(`Returning cached result for server configuration ID: ${config.id}`);
      return cachedResult;
    }

    try {
      const dataSource = await this.getOrCreateDataSource(config);
      const query = queries[config.driver];
      const result = await dataSource.query(query);
      const databases = result.map((row: any) => Object.values(row)[0]);

      // Cache the result for 5 minutes
      await this.cacheService.set(cacheKey, databases, 300);

      // Clean up the connection pool after caching
      await this.cleanUpConnections();

      return databases;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to test database connection for ID ${config.id}: ${errorMessage}`);
      throw new BadRequestException(`Database connection test failed: ${errorMessage}`);
    }
  }

  async cleanUpConnections(): Promise<void> {
    this.logger.log('Cleaning up all connection pools and cache.');
    for (const key in this.connectionPools) {
      try {
        await this.connectionPools[key].destroy();
        delete this.connectionPools[key];
      } catch (error) {
        this.logger.error(`Failed to destroy DataSource for key: ${key}`, error);
      }
    }
    this.logger.log('Cleaned up all connection pools and cache.');
  }

  private async getOrCreateDataSource(config: ServerConfiguration): Promise<DataSource> {
    const configKey = `${config.driver}_${config.ipAddress}_${config.user}`;
    if (!this.connectionPools[configKey]) {
      this.logger.log(`Creating new DataSource for configKey: ${configKey}`);
      const dataSourceOptions = this.buildDataSourceOptions(config);
      const dataSource = new DataSource(dataSourceOptions);
      await dataSource.initialize();
      this.connectionPools[configKey] = dataSource;
    }
    return this.connectionPools[configKey];
  }

  private buildDataSourceOptions(config: ServerConfiguration): DataSourceOptions {
    const ports: Record<string, number> = {
      postgres: 5432,
      mysql: 3306,
      mariadb: 3306,
      sqlite: 0,
      mssql: 1433,
    };

    return {
      type: config.driver as any,
      host: config.ipAddress,
      port: config.driver ? ports[config.driver] || 3306 : 3306,
      username: config.user || '',
      password: config.password ? config.password.toString('utf-8') : '',
      database: config.driver === 'mssql' ? 'master' : '',
      synchronize: false,
      logging: false,
      poolSize: 5,
    };
  }
}
