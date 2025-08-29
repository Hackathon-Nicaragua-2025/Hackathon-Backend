import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';

import { CreateDatabaseConfigurationDto } from './dto/create-database-configuration.dto';
import { DatabaseConfigurationResponseDto } from './dto/database-configuration-response.dto';
import { DatabaseConfiguration } from '../common/entities/config/database-configuration.entity';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';

const SELECT_FIELDS: (keyof DatabaseConfiguration)[] = [
  'id',
  'serverName',
  'databaseName',
  'isEnabled',
  'ingestedDate',
  'server',
];

@Injectable()
export class DatabaseConfigurationService {
  private readonly logger = new Logger(DatabaseConfigurationService.name);

  constructor(
    @InjectRepository(DatabaseConfiguration)
    private readonly databaseConfigurationRepository: Repository<DatabaseConfiguration>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<DatabaseConfiguration> | null,
    filteringParams: FilteringParam<DatabaseConfiguration> | null,
  ): Promise<{ data: DatabaseConfigurationResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate where conditions based on filtering parameters
      const where = getWhereConditions<DatabaseConfiguration>(filteringParams);

      // Generate sorting order based on sorting parameters
      const order = getSortingOrder<DatabaseConfiguration>(sortingParams);

      // Retrieve data with pagination and sorting from the repository
      const [data, totalItems] = await this.databaseConfigurationRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: SELECT_FIELDS,
        relations: {
          server: true,
        },
      });

      // Calculate pagination metadata
      const pageCount = Math.ceil(totalItems / limit);
      const meta: PaginatedMetaDto = {
        page,
        take: limit,
        itemCount: totalItems,
        pageCount,
        hasPreviousPage: page > 1,
        hasNextPage: page < pageCount,
      };

      // Transform data to the response DTO
      return {
        data: plainToInstance(DatabaseConfigurationResponseDto, data),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Log or handle database-related errors
      throw error; // Re-throw the error after handling it
    }
  }

  async findOne(id: number): Promise<DatabaseConfigurationResponseDto> {
    try {
      const configuration = await this.databaseConfigurationRepository.findOne({
        where: { id },
        select: ['id', 'serverName', 'databaseName', 'isEnabled', 'ingestedDate'],
      });

      if (!configuration) {
        this.logger.warn(`DatabaseConfiguration with ID ${id} not found`);
        throw new NotFoundException(`DatabaseConfiguration with ID ${id} not found`);
      }

      return plainToInstance(DatabaseConfigurationResponseDto, configuration, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }

  async findByServerName(serverName: string): Promise<DatabaseConfiguration[]> {
    try {
      return this.databaseConfigurationRepository.find({ where: { serverName } });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async create(data: CreateDatabaseConfigurationDto): Promise<DatabaseConfigurationResponseDto> {
    try {
      const result = await this.databaseConfigurationRepository.save(data);
      return plainToInstance(DatabaseConfigurationResponseDto, result, { excludeExtraneousValues: true });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async softDeletes(ids: number[]): Promise<void> {
    try {
      const result = await this.databaseConfigurationRepository.softDelete(ids);
      if (result.affected === 0) {
        this.logger.warn(`DatabaseConfiguration with IDs ${ids.join(', ')} not found`);
        throw new NotFoundException(`DatabaseConfiguration with IDs ${ids.join(', ')} not found`);
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
