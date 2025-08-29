import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ServerMetrics } from '../common/entities/raw/server_metrics.entity';
import { ServerMetricsResponseDto } from './dto/server-metric.dto';
import { FilteringParam, PaginationParam, SortingParam } from '../common/decorators';
import { getWhereConditions, getSortingOrder, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';

@Injectable()
export class ServerMetricService {
  private readonly logger = new Logger(ServerMetricService.name);

  constructor(
    @InjectRepository(ServerMetrics)
    private readonly serverMetricsRepository: Repository<ServerMetrics>,
  ) {}

  async getList<T extends ServerMetrics>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: ServerMetricsResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.serverMetricsRepository.findAndCount({
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
        data: plainToInstance(ServerMetricsResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ServerMetricsResponseDto> {
    try {
      const serverMetric = await this.serverMetricsRepository.findOne({
        where: { id: id },
        select: [
          'id',
          'serverName',
          'queryCount',
          'databaseCount',
          'activeSessions',
          'memoryUsagePercent',
          'totalDiskIo',
          'lastWaitType',
          'lastWaitTimeMs',
          'lastCpuTimeMs',
          'ingestedTimestamp',
        ],
      });

      if (!serverMetric) {
        this.logger.warn(`ServerMetric with ID ${id} not found`);
        throw new NotFoundException(`ServerMetric with ID ${id} not found`);
      }

      return plainToInstance(ServerMetricsResponseDto, serverMetric, {
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
