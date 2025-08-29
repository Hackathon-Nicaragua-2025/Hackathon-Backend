import { Controller, Get, Param, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { StatsPerIndexService } from './stats-per-index.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { StatsPerIndexResponseDto } from './dto/stats-per-index.dto';
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
import { StatsPerIndex } from '../common/entities/raw/stats-per-index.entity';
import { PermissionActions } from '../authentication/enums/authorization.enum';

// Define a constant for sorting and filtering fields to avoid repetition
const STATS_PER_INDEX_SORT_FILTER_FIELDS: (keyof StatsPerIndex)[] = [
  'schemaName',
  'tableName',
  'indexName',
  'typeDesc',
  'numberOfWrite',
  'numberOfSeeks',
  'numberOfScans',
  'serverName',
  'databaseName',
  'ingestedTimestamp',
];

@ApiBearerAuth() // Ensure the controller requires JWT authentication
@Controller('stats-per-indexes')
@ApiTags('Stats Per Index')
@UseGuards(AuthGuard('jwt')) // Apply JWT authentication globally
export class StatsPerIndexController {
  constructor(private readonly statsPerIndexService: StatsPerIndexService) {}

  @ApiOperation({ summary: 'Get all stats per index with pagination, filtering, and sorting' })
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @ApiResponseWithPagination(StatsPerIndexResponseDto, 'Successfully retrieved stats per index', HttpStatus.OK)
  @ApiSortingQuery<StatsPerIndex>(STATS_PER_INDEX_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<StatsPerIndex>(STATS_PER_INDEX_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<StatsPerIndex>(STATS_PER_INDEX_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<StatsPerIndex> | null,
    @FilteringParams<StatsPerIndex>(STATS_PER_INDEX_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<StatsPerIndex> | null,
  ): Promise<PaginatedResponseDto<StatsPerIndexResponseDto>> {
    const { data, meta } = await this.statsPerIndexService.getList<StatsPerIndex>(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Stats per index Retrieved',
      'Successfully retrieved stats per index with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific stat per index by ID' })
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @ApiResponseWithData(StatsPerIndexResponseDto, 'Stat per index retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Stat per index not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<StatsPerIndexResponseDto>> {
    const stat = await this.statsPerIndexService.findOne(id);
    return ApiResponseDto.Success(stat, 'Stat Per Index Retrieved', 'Successfully retrieved stat per index.');
  }
}
