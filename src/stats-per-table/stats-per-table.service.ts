import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { StatsPerTable } from '../common/entities/raw/stats-per-table.entity';
import { StatsPerTableResponseDto } from './dto/stats-per-table.dto';
import { getWhereConditions, getSortingOrder, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { FilteringParam, PaginationParam, SortingParam } from '../common/decorators';

@Injectable()
export class StatsPerTableService {
  private readonly logger = new Logger(StatsPerTableService.name);

  constructor(
    @InjectRepository(StatsPerTable)
    private readonly statsPerTableRepository: Repository<StatsPerTable>,
  ) {}

  async getList<T extends StatsPerTable>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: StatsPerTableResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.statsPerTableRepository.findAndCount({
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
        data: plainToInstance(StatsPerTableResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<StatsPerTableResponseDto> {
    try {
      const stat = await this.statsPerTableRepository.findOne({
        where: { id: id },
        select: [
          'id',
          'tableName',
          'indexCount',
          'indexNames',
          'numberOfRows',
          'similarKeyStatus',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
        ],
      });

      if (!stat) {
        this.logger.warn(`StatsPerTable with ID ${id} not found`);
        throw new NotFoundException(`StatsPerTable with ID ${id} not found`);
      }

      return plainToInstance(StatsPerTableResponseDto, stat, {
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
