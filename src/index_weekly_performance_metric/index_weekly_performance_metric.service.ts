import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndexWeeklyPerformanceMetric } from '../common/entities/model/index-weekly-performance-metric.entity';
import { IndexWeeklyPerformanceMetricResponseDto } from './dto/index-weekly-performance-metric-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class IndexWeeklyPerformanceMetricService {
  private readonly logger = new Logger(IndexWeeklyPerformanceMetricService.name);

  constructor(
    @InjectRepository(IndexWeeklyPerformanceMetric)
    private readonly indexWeeklyPerformanceMetricRepository: Repository<IndexWeeklyPerformanceMetric>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<IndexWeeklyPerformanceMetric> | null,
    filteringParams: FilteringParam<IndexWeeklyPerformanceMetric> | null,
  ): Promise<{ data: IndexWeeklyPerformanceMetricResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate where conditions based on filtering parameters
      const where = getWhereConditions<IndexWeeklyPerformanceMetric>(filteringParams);

      // Generate sorting order based on sorting parameters
      const order = getSortingOrder<IndexWeeklyPerformanceMetric>(sortingParams);

      // Retrieve data with pagination and sorting from the repository
      const [data, totalItems] = await this.indexWeeklyPerformanceMetricRepository.findAndCount({
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
        data: plainToInstance(IndexWeeklyPerformanceMetricResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Log or handle database-related errors
      throw error; // Re-throw the error after handling it
    }
  }

  async findOne(id: number): Promise<IndexWeeklyPerformanceMetricResponseDto> {
    try {
      const metric = await this.indexWeeklyPerformanceMetricRepository.findOne({
        where: { id },
        select: [
          'indexId',
          'weekEndDate',
          'indexName',
          'numberOfWrite',
          'numberOfSeeks',
          'numberOfScans',
          'transformedTimestamp',
        ],
      });

      if (!metric) {
        this.logger.warn(`IndexWeeklyPerformanceMetric with ID ${id} not found`);
        throw new NotFoundException(`IndexWeeklyPerformanceMetric with ID ${id} not found`);
      }

      return plainToInstance(IndexWeeklyPerformanceMetricResponseDto, metric, {
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
