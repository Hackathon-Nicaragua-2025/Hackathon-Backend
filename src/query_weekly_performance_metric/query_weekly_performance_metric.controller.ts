import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { QueryWeeklyPerformanceMetricService } from './query_weekly_performance_metric.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { QueryWeeklyPerformanceMetricResponseDto } from './dto/query-weekly-performance-metric-response.dto';
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
import { QueryWeeklyPerformanceMetric } from '../common/entities/model/query-weekly-performance-metric.entity';

const QUERY_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS: (keyof QueryWeeklyPerformanceMetric)[] = [
  'queryId',
  'weekEndDate',
  'executionCount',
  'cpuTime',
  'elapsedTime',
  'logicalReads',
  'logicalWrites',
  'transformedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Query Weekly Performance Metrics')
@Controller('query-weekly-performance-metrics')
export class QueryWeeklyPerformanceMetricController {
  constructor(private readonly queryWeeklyPerformanceMetricService: QueryWeeklyPerformanceMetricService) {}

  @ApiOperation({ summary: 'Get all query weekly performance metrics with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(QueryWeeklyPerformanceMetricResponseDto, 'Successfully retrieved metrics', HttpStatus.OK)
  @ApiSortingQuery<QueryWeeklyPerformanceMetric>(QUERY_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<QueryWeeklyPerformanceMetric>(QUERY_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<QueryWeeklyPerformanceMetric>(QUERY_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<QueryWeeklyPerformanceMetric> | null,
    @FilteringParams<QueryWeeklyPerformanceMetric>(QUERY_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<QueryWeeklyPerformanceMetric> | null,
  ): Promise<PaginatedResponseDto<QueryWeeklyPerformanceMetricResponseDto>> {
    const { data, meta } = await this.queryWeeklyPerformanceMetricService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Metrics Retrieved',
      'Successfully retrieved query weekly performance metrics with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific query weekly performance metric by ID' })
  @ApiResponseWithData(QueryWeeklyPerformanceMetricResponseDto, 'Metric retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Metric not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<QueryWeeklyPerformanceMetricResponseDto>> {
    const metric = await this.queryWeeklyPerformanceMetricService.findOne(id);
    return ApiResponseDto.Success(
      metric,
      'Metric Retrieved',
      'Successfully retrieved query weekly performance metric.',
    );
  }
}
