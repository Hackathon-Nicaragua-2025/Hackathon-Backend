import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { DatabaseResponseDto } from './dto/database-response.dto';
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
import { Database } from '../common/entities/model/database.entity';

const DATABASE_SORT_FILTER_FIELDS: (keyof Database)[] = [
  'id',
  'serverName',
  'name',
  'creationDate',
  'dbId',
  'databaseName',
  'compatibilityLevel',
  'stateDesc',
  'dbCreationDate',
  'dbCompatibilityLevel',
  'totalSizeMb',
  'usedSpaceMb',
  'dbState',
  'dbRecoveryModel',
  'dataTotalSizeMb',
  'dataUsedSpaceMb',
  'logTotalSizeMb',
  'logUsedSpaceMb',
];

@ApiBearerAuth()
@ApiTags('Databases')
@Controller('databases')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @ApiOperation({ summary: 'Get all databases with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(DatabaseResponseDto, 'Successfully retrieved databases', HttpStatus.OK)
  @ApiSortingQuery<Database>(DATABASE_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<Database>(DATABASE_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<Database>(DATABASE_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<Database> | null,
    @FilteringParams<Database>(DATABASE_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<Database> | null,
  ): Promise<PaginatedResponseDto<DatabaseResponseDto>> {
    const { data, meta } = await this.databaseService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Databases Retrieved',
      'Successfully retrieved databases with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific database by ID' })
  @ApiResponseWithData(DatabaseResponseDto, 'Database retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Database not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<DatabaseResponseDto>> {
    const database = await this.databaseService.findOne(id);
    return ApiResponseDto.Success(database, 'Database Retrieved', 'Successfully retrieved database.');
  }
}
