import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseInformation } from '../common/entities/raw/database-information.entity';
import { DatabaseInformationResponseDto } from './dto/database-information-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DatabaseInformationService {
  private readonly logger = new Logger(DatabaseInformationService.name);

  constructor(
    @InjectRepository(DatabaseInformation)
    private readonly databaseInformationRepository: Repository<DatabaseInformation>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<DatabaseInformation> | null,
    filteringParams: FilteringParam<DatabaseInformation> | null,
  ): Promise<{ data: DatabaseInformationResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions
      const where = getWhereConditions<DatabaseInformation>(filteringParams);

      // Generate sorting order based on sorting parameters
      const order = getSortingOrder<DatabaseInformation>(sortingParams);

      // Retrieve data with pagination and sorting from the repository
      const [data, totalItems] = await this.databaseInformationRepository.findAndCount({
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
        data: plainToInstance(DatabaseInformationResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Log or handle database-related errors
      throw error; // Re-throw the error after handling it
    }
  }

  async findOne(id: number): Promise<DatabaseInformationResponseDto> {
    try {
      const databaseInfo = await this.databaseInformationRepository.findOne({
        where: { id },
        select: [
          'id',
          'serverName',
          'databaseId',
          'name',
          'creationDate',
          'compatibilityLevel',
          'stateDesc',
          'recoveryModel',
          'dataTotalSizeMb',
          'dataUsedSpaceMb',
          'logTotalSizeMb',
          'logUsedSpaceMb',
          'ingestedTimestamp',
        ],
      });

      if (!databaseInfo) {
        this.logger.warn(`DatabaseInformation with ID ${id} not found`);
        throw new NotFoundException(`DatabaseInformation with ID ${id} not found`);
      }

      return plainToInstance(DatabaseInformationResponseDto, databaseInfo, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
