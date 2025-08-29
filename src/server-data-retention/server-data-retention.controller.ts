import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ServerDataRetentionService } from './server-data-retention.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { ServerDataRetentionResponseDto } from './dto/server-data-retention-response.dto';
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
import { ServerDataRetention } from '../common/entities/config/server-data-retention .entity';
const SERVER_DATA_RETENTION_SORT_FILTER_FIELDS: (keyof ServerDataRetention)[] = [
  'id',
  'serverId',
  'serverName',
  'retentionDays',
];

@ApiBearerAuth()
@ApiTags('Server Data Retention')
@Controller('server-data-retentions')
export class ServerDataRetentionController {
  constructor(private readonly serverDataRetentionService: ServerDataRetentionService) {}

  @ApiOperation({ summary: 'Get all server data retention records with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(
    ServerDataRetentionResponseDto,
    'Successfully retrieved server data retention records',
    HttpStatus.OK,
  )
  @ApiSortingQuery<ServerDataRetention>(SERVER_DATA_RETENTION_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<ServerDataRetention>(SERVER_DATA_RETENTION_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<ServerDataRetention>(SERVER_DATA_RETENTION_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<ServerDataRetention> | null,
    @FilteringParams<ServerDataRetention>(SERVER_DATA_RETENTION_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<ServerDataRetention> | null,
  ): Promise<PaginatedResponseDto<ServerDataRetentionResponseDto>> {
    const { data, meta } = await this.serverDataRetentionService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Server Data Retention Records Retrieved',
      'Successfully retrieved server data retention records with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific server data retention record by ID' })
  @ApiResponseWithData(
    ServerDataRetentionResponseDto,
    'Server data retention record retrieved successfully',
    HttpStatus.OK,
  )
  @ApiResponseWithData(null, 'Server data retention record not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<ServerDataRetentionResponseDto>> {
    const serverDataRetention = await this.serverDataRetentionService.findOne(id);
    return ApiResponseDto.Success(
      serverDataRetention,
      'Server Data Retention Record Retrieved',
      'Successfully retrieved server data retention record.',
    );
  }
}
