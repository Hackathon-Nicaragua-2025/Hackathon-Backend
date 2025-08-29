import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { StatsPerIndex } from '../common/entities/raw/stats-per-index.entity';
import { StatsPerIndexResponseDto } from './dto/stats-per-index.dto';
import { getWhereConditions, getSortingOrder, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { FilteringParam, PaginationParam, SortingParam } from '../common/decorators';

@Injectable()
export class StatsPerIndexService {
  private readonly logger = new Logger(StatsPerIndexService.name);

  constructor(
    @InjectRepository(StatsPerIndex)
    private readonly statsPerIndexRepository: Repository<StatsPerIndex>,
  ) {}

  async getList<T extends StatsPerIndex>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: StatsPerIndexResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.statsPerIndexRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
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
        data: plainToInstance(StatsPerIndexResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<StatsPerIndexResponseDto> {
    try {
      const stat = await this.statsPerIndexRepository.findOne({
        where: { id: id },
        select: [
          'id',
          'schemaName',
          'tableName',
          'indexName',
          'typeDesc',
          'numberOfWrite',
          'numberOfSeeks',
          'numberOfScans',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
        ],
      });

      if (!stat) {
        this.logger.warn(`StatsPerIndex with ID ${id} not found`);
        throw new NotFoundException(`StatsPerIndex with ID ${id} not found`);
      }

      return plainToInstance(StatsPerIndexResponseDto, stat, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
