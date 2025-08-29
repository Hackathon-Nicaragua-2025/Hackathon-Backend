import { Controller, Get, Param, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { ServerMetricService } from './server-metric.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ServerMetricsResponseDto } from './dto/server-metric.dto';
import { ServerMetrics } from '../common/entities/raw/server_metrics.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResponseDto } from '../common/dto/api-paginated-response.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import {
  ApiResponseWithData,
  ApiResponseWithPagination,
  ApiSortingQuery,
  FilteringParams,
  PaginationParam,
  PaginationParams,
  ApiFilteringQuery,
  SortingParams,
  FilteringParam,
  SortingParam,
  ApiPaginationQuery,
} from '../common/decorators';
import { PermissionActions } from '../authentication/enums/authorization.enum';

// Define a constant for sorting and filtering fields to avoid repetition
const SERVER_METRICS_SORT_FILTER_FIELDS: (keyof ServerMetrics)[] = [
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
];

@ApiBearerAuth() // Ensure the controller requires JWT authentication
@Controller('server-metrics')
@ApiTags('Server Metrics')
@UseGuards(AuthGuard('jwt')) // Apply JWT authentication globally
export class ServerMetricController {
  constructor(private readonly serverMetricService: ServerMetricService) {}

  @ApiOperation({ summary: 'Get all server metrics with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(ServerMetricsResponseDto, 'Successfully retrieved server metrics', HttpStatus.OK)
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @ApiSortingQuery<ServerMetrics>([
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
  ])
  @ApiFilteringQuery<ServerMetrics>([
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
  ])
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<ServerMetrics>(SERVER_METRICS_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<ServerMetrics> | null,
    @FilteringParams<ServerMetrics>(SERVER_METRICS_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<ServerMetrics> | null,
  ): Promise<PaginatedResponseDto<ServerMetricsResponseDto>> {
    const { data, meta } = await this.serverMetricService.getList<ServerMetrics>(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Server Metrics Retrieved',
      'Successfully retrieved server metrics with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get server metric by ID' })
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @ApiResponseWithData(ServerMetricsResponseDto, 'Server metric retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Server metric not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<ServerMetricsResponseDto>> {
    const serverMetric = await this.serverMetricService.findOne(id);
    return ApiResponseDto.Success(serverMetric, 'Server Metric Retrieved', 'Successfully retrieved server metric.');
  }
}
