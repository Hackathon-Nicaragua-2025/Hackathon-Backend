import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Injectable, Logger } from '@nestjs/common';

import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { ConnectionService } from '../common/services/connection.service';
import { CreateServerConfigurationDto } from './dto/create-server-configuration.dto';
import { UpdateServerConfigurationDto } from './dto/update-server-configuration.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { ServerConfigurationResponseDto } from './dto/server-configuration-response.dto';
import { ServerConfiguration } from '../common/entities/config/server-configuration.entity';
import { DatabaseConfigurationService } from '../database-configuration/database-configuration.service';
import { getWhereConditions, getSortingOrder, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { DatabaseConfigurationResponseDto } from '../database-configuration/dto/database-configuration-response.dto';
import { TestDatabaseConnectionResponseDto } from './dto/test-database-connection-response.dto';
import { BadRequestException, NotFoundException } from '../common/exceptions/custom-exceptions';

const SELECT_FIELDS: (keyof ServerConfiguration)[] = [
  'id',
  'serverName',
  'ipAddress',
  'driver',
  'updateFrequency',
  'timeout',
  'isEnabled',
  'lastRunTime',
  'nextRunTime',
  'user',
  'databases',
  'createdAt',
  'updatedAt',
  'deletedAt',
];

@Injectable()
export class ServerConfigurationService {
  private readonly logger = new Logger(ServerConfigurationService.name);

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly databaseConfigService: DatabaseConfigurationService,
    @InjectRepository(ServerConfiguration)
    private readonly serverConfigurationRepository: Repository<ServerConfiguration>,
  ) {}

  async getList<T extends ServerConfiguration>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: ServerConfigurationResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.serverConfigurationRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        relations: {
          databases: true,
        },
        select: SELECT_FIELDS,
      });

      // Calculate total pages and other pagination metadata
      const pageCount = Math.ceil(totalItems / limit);
      const meta: PaginatedMetaDto = {
        page,
        take: limit,
        itemCount: totalItems,
        pageCount,
        hasPreviousPage: page > 1,
        hasNextPage: page < pageCount,
      };

      return {
        data: plainToInstance(ServerConfigurationResponseDto, data, { excludeExtraneousValues: false }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ServerConfigurationResponseDto> {
    try {
      const serverConfig = await this.serverConfigurationRepository.findOne({
        where: { id: id },
        select: [
          'id',
          'serverName',
          'ipAddress',
          'updateFrequency',
          'timeout',
          'isEnabled',
          'lastRunTime',
          'nextRunTime',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'user',
          'databases',
        ],
      });

      if (!serverConfig) {
        this.logger.warn(`Server configuration with ID ${id} not found.`);
        throw new NotFoundException(`Server configuration with ID ${id} not found.`);
      }

      return plainToInstance(ServerConfigurationResponseDto, serverConfig, { excludeExtraneousValues: true });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async create(createServerConfigurationDto: CreateServerConfigurationDto): Promise<ServerConfigurationResponseDto> {
    try {
      this.logger.log(`Creating server configuration for user`);
      const newServerConfig = this.serverConfigurationRepository.create({
        ...createServerConfigurationDto,
        // todo: encrypt password before saving
        password: createServerConfigurationDto.password
          ? Buffer.from(createServerConfigurationDto.password, 'utf-8')
          : undefined,
      });

      const savedConfig = await this.serverConfigurationRepository.save(newServerConfig);
      this.logger.log(`Successfully created server configuration with ID ${savedConfig.id}`);

      return plainToInstance(ServerConfigurationResponseDto, savedConfig, { excludeExtraneousValues: true });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async update(
    id: number,
    updateServerConfigurationDto: UpdateServerConfigurationDto,
  ): Promise<ServerConfigurationResponseDto> {
    const existingConfig = await this.serverConfigurationRepository.findOne({ where: { id: id } });

    if (!existingConfig) {
      this.logger.warn(`Server configuration with ID ${id} not found.`);
      throw new NotFoundException(`Server configuration with ID ${id} not found.`);
    }

    const updatedConfig = Object.assign(existingConfig, updateServerConfigurationDto);

    try {
      const savedConfig = await this.serverConfigurationRepository.save(updatedConfig);
      this.logger.log(`Successfully updated server configuration with ID ${savedConfig.id}`);
      return plainToInstance(ServerConfigurationResponseDto, savedConfig, { excludeExtraneousValues: true });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async softDelete(id: number): Promise<ServerConfigurationResponseDto> {
    const serverConfig = await this.serverConfigurationRepository.findOne({
      where: { id: id, deletedAt: IsNull() },
    });

    if (!serverConfig) {
      this.logger.warn(`Server configuration with ID ${id} not found or already deleted.`);
      throw new NotFoundException(`Server configuration with ID ${id} not found or already deleted.`);
    }

    serverConfig.deletedAt = new Date();

    try {
      await this.serverConfigurationRepository.save(serverConfig);
      this.logger.log(`Successfully soft deleted server configuration with ID ${id}`);
      return plainToInstance(ServerConfigurationResponseDto, serverConfig, { excludeExtraneousValues: true });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async restore(id: number): Promise<ServerConfigurationResponseDto> {
    const serverConfig = await this.serverConfigurationRepository.findOne({
      where: { id: id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });

    if (!serverConfig) {
      this.logger.warn(`Server configuration with ID ${id} not found or not deleted.`);
      throw new NotFoundException(`Server configuration with ID ${id} not found or not deleted.`);
    }

    await this.serverConfigurationRepository.update(id, { deletedAt: undefined });

    const restoredConfig = await this.serverConfigurationRepository.findOne({ where: { id: id } });

    if (!restoredConfig) {
      this.logger.warn(`Server configuration with ID ${id} not found after restoration.`);
      throw new NotFoundException(`Server configuration with ID ${id} not found after restoration.`);
    }

    this.logger.log(`Successfully restored server configuration with ID ${id}`);
    return plainToInstance(ServerConfigurationResponseDto, restoredConfig, { excludeExtraneousValues: true });
  }

  async testDatabaseConnection(id: number): Promise<TestDatabaseConnectionResponseDto> {
    const config = await this.serverConfigurationRepository.findOneOrFail({ where: { id } });

    if (!config.isEnabled) {
      throw new BadRequestException('Server configuration is disabled.');
    }

    try {
      const [localDatabases, serverDatabases] = await Promise.all([
        this.databaseConfigService.findByServerName(config.serverName),
        this.connectionService.getListDatabaseByServerConfiguration(config),
      ]);

      // Create a dictionary of local databases using JavaScript native methods
      const localDatabasesDict = Object.fromEntries(localDatabases.map((db) => [db.databaseName, db]));
      const finalDatabaseList: DatabaseConfigurationResponseDto[] = [];

      // Save newly discovered databases
      await Promise.all(
        serverDatabases.map(async (serverDatabase) => {
          if (!localDatabasesDict[serverDatabase]) {
            const database = await this.databaseConfigService.create({
              isEnabled: true,
              databaseName: serverDatabase,
              serverName: config.serverName,
            });
            finalDatabaseList.push(database);
          }
          // else {
          //   finalDatabaseList.push(localDatabasesDict[serverDatabase]);
          // }
        }),
      );

      // Soft delete local databases not found on the server
      const databasesToDelete = localDatabases
        .filter((localDatabase) => !serverDatabases.includes(localDatabase.databaseName))
        .map((localDatabase) => localDatabase.id);

      if (databasesToDelete.length > 0) {
        await this.databaseConfigService.softDeletes(databasesToDelete);
      }

      return { databases: finalDatabaseList };
    } catch (error) {
      throw error;
    }
  }
}
