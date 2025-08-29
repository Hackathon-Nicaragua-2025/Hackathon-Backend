import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryWeeklyPerformanceMetric } from '../common/entities/model/query-weekly-performance-metric.entity';
import { QueryWeeklyPerformanceMetricResponseDto } from './dto/query-weekly-performance-metric-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class QueryWeeklyPerformanceMetricService {
  private readonly logger = new Logger(QueryWeeklyPerformanceMetricService.name);

  constructor(
    @InjectRepository(QueryWeeklyPerformanceMetric)
    private readonly queryWeeklyPerformanceMetricRepository: Repository<QueryWeeklyPerformanceMetric>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<QueryWeeklyPerformanceMetric> | null,
    filteringParams: FilteringParam<QueryWeeklyPerformanceMetric> | null,
  ): Promise<{ data: QueryWeeklyPerformanceMetricResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions<QueryWeeklyPerformanceMetric>(filteringParams);

      const order = getSortingOrder<QueryWeeklyPerformanceMetric>(sortingParams);

      const [data, totalItems] = await this.queryWeeklyPerformanceMetricRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
      });

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
        data: plainToInstance(QueryWeeklyPerformanceMetricResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<QueryWeeklyPerformanceMetricResponseDto> {
    try {
      const metric = await this.queryWeeklyPerformanceMetricRepository.findOne({
        where: { id: id },
        select: [
          'queryId',
          'weekEndDate',
          'queryHash',
          'executionCount',
          'cpuTime',
          'elapsedTime',
          'logicalReads',
          'logicalWrites',
          'transformedTimestamp',
        ],
      });

      if (!metric) {
        this.logger.warn(`QueryWeeklyPerformanceMetric with ID ${id} not found`);
        throw new NotFoundException(`QueryWeeklyPerformanceMetric with ID ${id} not found`);
      }

      return plainToInstance(QueryWeeklyPerformanceMetricResponseDto, metric, {
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
