import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { TableWeeklyPerformanceMetricService } from './table_weekly_performance_metric.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { TableWeeklyPerformanceMetricResponseDto } from './dto/table-weekly-performance-metric-reponse.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import {
  ApiFilteringQuery,
  ApiPaginationQuery,
  ApiResponseWithPagination,
  ApiSortingQuery,
  FilteringParam,
  FilteringParams,
  PaginationParam,
  PaginationParams,
  SortingParam,
  SortingParams,
} from '../common/decorators';
import { PaginatedResponseDto } from '../common/dto/api-paginated-response.dto';
import { TableWeeklyPerformanceMetric } from '../common/entities/model/table-weekly-performance-metric.entity';

const TABLE_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS: (keyof TableWeeklyPerformanceMetric)[] = [
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
];

@ApiBearerAuth()
@ApiTags('Table Weekly Performance Metrics')
@Controller('table-weekly-performance-metrics')
export class TableWeeklyPerformanceMetricController {
  constructor(private readonly tableWeeklyPerformanceMetricService: TableWeeklyPerformanceMetricService) {}

  @ApiOperation({ summary: 'Get all table weekly performance metrics with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(TableWeeklyPerformanceMetricResponseDto, 'Successfully retrieved metrics', HttpStatus.OK)
  @ApiSortingQuery<TableWeeklyPerformanceMetric>(TABLE_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<TableWeeklyPerformanceMetric>(TABLE_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<TableWeeklyPerformanceMetric>(TABLE_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<TableWeeklyPerformanceMetric> | null,
    @FilteringParams<TableWeeklyPerformanceMetric>(TABLE_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<TableWeeklyPerformanceMetric> | null,
  ): Promise<PaginatedResponseDto<TableWeeklyPerformanceMetricResponseDto>> {
    const { data, meta } = await this.tableWeeklyPerformanceMetricService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Metrics Retrieved',
      'Successfully retrieved table weekly performance metrics with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific table weekly performance metric by ID' })
  @ApiResponseWithData(TableWeeklyPerformanceMetricResponseDto, 'Metric retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Metric not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<TableWeeklyPerformanceMetricResponseDto>> {
    const metric = await this.tableWeeklyPerformanceMetricService.findOne(id);
    return ApiResponseDto.Success(
      metric,
      'Metric Retrieved',
      'Successfully retrieved table weekly performance metric.',
    );
  }
}
