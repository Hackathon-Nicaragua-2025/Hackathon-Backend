import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Database } from '../common/entities/model/database.entity';
import { DatabaseResponseDto } from './dto/database-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectRepository(Database)
    private readonly databaseRepository: Repository<Database>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<Database> | null,
    filteringParams: FilteringParam<Database> | null,
  ): Promise<{ data: DatabaseResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions
      const where = getWhereConditions<Database>(filteringParams);

      // Generate sorting order based on sorting parameters
      const order = getSortingOrder<Database>(sortingParams);

      // Retrieve data with pagination and sorting from the repository
      const [data, totalItems] = await this.databaseRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
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
        data: plainToInstance(DatabaseResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Log or handle database-related errors
      throw error; // Re-throw the error after handling it
    }
  }

  async findOne(id: number): Promise<DatabaseResponseDto> {
    try {
      const database = await this.databaseRepository.findOne({
        where: { id },
        select: [
          'id',
          'serverName',
          'name',
          'creationDate',
          'dbId',
          'databaseName',
          'compatibilityLevel',
          'stateDesc',
          'dbCreationDate',
          'dbCompatibilityLevel',
          'totalSizeMb',
          'usedSpaceMb',
          'dbState',
          'dbRecoveryModel',
          'dataTotalSizeMb',
          'dataUsedSpaceMb',
          'logTotalSizeMb',
          'logUsedSpaceMb',
          'ingestionTimestamp',
          'transformedTimestamp',
        ],
      });

      if (!database) {
        this.logger.warn(`Database with ID ${id} not found`);
        throw new NotFoundException(`Database with ID ${id} not found`);
      }

      return plainToInstance(DatabaseResponseDto, database, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
