import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { DatabaseInformationService } from './database-information.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { DatabaseInformationResponseDto } from './dto/database-information-response.dto';
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
import { DatabaseInformation } from '../common/entities/raw/database-information.entity';

const DATABASE_INFORMATION_SORT_FILTER_FIELDS: (keyof DatabaseInformation)[] = [
  'id',
  'serverName',
  'databaseId',
  'name',
  'creationDate',
  'compatibilityLevel',
  'stateDesc',
  'recoveryModel',
  'dataTotalSizeMb',
  'dataUsedSpaceMb',
  'logTotalSizeMb',
  'logUsedSpaceMb',
  'ingestedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Database Informations')
@Controller('database-informations')
export class DatabaseInformationController {
  constructor(private readonly databaseInformationService: DatabaseInformationService) {}

  @ApiOperation({ summary: 'Get all database information records with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(
    DatabaseInformationResponseDto,
    'Successfully retrieved database information records',
    HttpStatus.OK,
  )
  @ApiSortingQuery<DatabaseInformation>(DATABASE_INFORMATION_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<DatabaseInformation>(DATABASE_INFORMATION_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<DatabaseInformation>(DATABASE_INFORMATION_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<DatabaseInformation> | null,
    @FilteringParams<DatabaseInformation>(DATABASE_INFORMATION_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<DatabaseInformation> | null,
  ): Promise<PaginatedResponseDto<DatabaseInformationResponseDto>> {
    const { data, meta } = await this.databaseInformationService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Database Information Retrieved',
      'Successfully retrieved database information records with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific database information record by ID' })
  @ApiResponseWithData(
    DatabaseInformationResponseDto,
    'Database information record retrieved successfully',
    HttpStatus.OK,
  )
  @ApiResponseWithData(null, 'Database information record not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<DatabaseInformationResponseDto>> {
    const databaseInformation = await this.databaseInformationService.findOne(id);
    return ApiResponseDto.Success(
      databaseInformation,
      'Database Information Retrieved',
      'Successfully retrieved database information record.',
    );
  }
}
