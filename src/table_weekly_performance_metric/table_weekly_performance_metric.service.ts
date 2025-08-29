import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableWeeklyPerformanceMetric } from '../common/entities/model/table-weekly-performance-metric.entity';
import { TableWeeklyPerformanceMetricResponseDto } from './dto/table-weekly-performance-metric-reponse.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TableWeeklyPerformanceMetricService {
  private readonly logger = new Logger(TableWeeklyPerformanceMetricService.name);

  constructor(
    @InjectRepository(TableWeeklyPerformanceMetric)
    private readonly tableWeeklyPerformanceMetricRepository: Repository<TableWeeklyPerformanceMetric>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<TableWeeklyPerformanceMetric> | null,
    filteringParams: FilteringParam<TableWeeklyPerformanceMetric> | null,
  ): Promise<{ data: TableWeeklyPerformanceMetricResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions<TableWeeklyPerformanceMetric>(filteringParams);

      const order = getSortingOrder<TableWeeklyPerformanceMetric>(sortingParams);

      const [data, totalItems] = await this.tableWeeklyPerformanceMetricRepository.findAndCount({
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
        data: plainToInstance(TableWeeklyPerformanceMetricResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<TableWeeklyPerformanceMetricResponseDto> {
    try {
      const metric = await this.tableWeeklyPerformanceMetricRepository.findOne({
        where: { tableId: id },
        select: [
          'tableId',
          'weekEndDate',
          'tableName',
          'databaseName',
          'serverName',
          'rowCount',
          'sizeMb',
          'totalReads',
          'totalWrites',
          'totalUpdates',
          'totalScans',
          'transformedTimestamp',
        ],
      });

      if (!metric) {
        this.logger.warn(`TableWeeklyPerformanceMetric with ID ${id} not found`);
        throw new NotFoundException(`TableWeeklyPerformanceMetric with ID ${id} not found`);
      }

      return plainToInstance(TableWeeklyPerformanceMetricResponseDto, metric, {
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
