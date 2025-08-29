import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { IndexWeeklyPerformanceMetricService } from './index_weekly_performance_metric.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { IndexWeeklyPerformanceMetricResponseDto } from './dto/index-weekly-performance-metric-response.dto';
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
import { IndexWeeklyPerformanceMetric } from '../common/entities/model/index-weekly-performance-metric.entity';

const INDEX_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS: (keyof IndexWeeklyPerformanceMetric)[] = [
  'indexId',
  'weekEndDate',
  'indexName',
  'numberOfWrite',
  'numberOfSeeks',
  'numberOfScans',
  'transformedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Index Weekly Performance Metrics')
@Controller('index-weekly-performance-metrics')
export class IndexWeeklyPerformanceMetricController {
  constructor(private readonly indexWeeklyPerformanceMetricService: IndexWeeklyPerformanceMetricService) {}

  @ApiOperation({ summary: 'Get all index weekly performance metrics with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(IndexWeeklyPerformanceMetricResponseDto, 'Successfully retrieved metrics', HttpStatus.OK)
  @ApiSortingQuery<IndexWeeklyPerformanceMetric>(INDEX_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<IndexWeeklyPerformanceMetric>(INDEX_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<IndexWeeklyPerformanceMetric>(INDEX_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<IndexWeeklyPerformanceMetric> | null,
    @FilteringParams<IndexWeeklyPerformanceMetric>(INDEX_WEEKLY_PERFORMANCE_METRIC_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<IndexWeeklyPerformanceMetric> | null,
  ): Promise<PaginatedResponseDto<IndexWeeklyPerformanceMetricResponseDto>> {
    const { data, meta } = await this.indexWeeklyPerformanceMetricService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Metrics Retrieved',
      'Successfully retrieved index weekly performance metrics with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific index weekly performance metric by ID' })
  @ApiResponseWithData(IndexWeeklyPerformanceMetricResponseDto, 'Metric retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Metric not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<IndexWeeklyPerformanceMetricResponseDto>> {
    const metric = await this.indexWeeklyPerformanceMetricService.findOne(id);
    return ApiResponseDto.Success(
      metric,
      'Metric Retrieved',
      'Successfully retrieved index weekly performance metric.',
    );
  }
}
