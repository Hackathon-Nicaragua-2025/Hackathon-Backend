import { Controller, Get, Param, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { StatsPerTableService } from './stats-per-table.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { StatsPerTableResponseDto } from './dto/stats-per-table.dto';
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
import { StatsPerTable } from '../common/entities/raw/stats-per-table.entity';
import { PermissionActions } from '../authentication/enums/authorization.enum';

// Define a constant for sorting and filtering fields to avoid repetition
const STATS_PER_TABLE_SORT_FILTER_FIELDS: (keyof StatsPerTable)[] = [
  'tableName',
  'indexCount',
  'numberOfRows',
  'serverName',
  'databaseName',
  'ingestedTimestamp',
];

@ApiBearerAuth() // Ensure the controller requires JWT authentication
@Controller('stats-per-tables')
@ApiTags('Stats Per Table')
@UseGuards(AuthGuard('jwt')) // Apply JWT authentication globally
export class StatsPerTableController {
  constructor(private readonly statsPerTableService: StatsPerTableService) {}

  @ApiOperation({ summary: 'Get all stats per table with pagination, filtering, and sorting' })
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @ApiResponseWithPagination(StatsPerTableResponseDto, 'Successfully retrieved stats per table', HttpStatus.OK)
  @ApiSortingQuery<StatsPerTable>(STATS_PER_TABLE_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<StatsPerTable>(STATS_PER_TABLE_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<StatsPerTable>(STATS_PER_TABLE_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<StatsPerTable> | null,
    @FilteringParams<StatsPerTable>(STATS_PER_TABLE_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<StatsPerTable> | null,
  ): Promise<PaginatedResponseDto<StatsPerTableResponseDto>> {
    const { data, meta } = await this.statsPerTableService.getList<StatsPerTable>(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Stat Per Table Retrieved',
      'Successfully retrieved stats Per Table with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific stat per table by ID' })
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @ApiResponseWithData(StatsPerTableResponseDto, 'Stat per table retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Stat per table not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<StatsPerTableResponseDto>> {
    const stat = await this.statsPerTableService.findOne(id);
    return ApiResponseDto.Success(stat, 'Stat Per Table Retrieved', 'Successfully retrieved stat per table.');
  }
}
