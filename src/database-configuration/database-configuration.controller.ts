import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { DatabaseConfigurationService } from './database-configuration.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { DatabaseConfigurationResponseDto } from './dto/database-configuration-response.dto';
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
import { DatabaseConfiguration } from '../common/entities/config/database-configuration.entity';

const DATABASE_CONFIGURATION_SORT_FILTER_FIELDS: (keyof DatabaseConfiguration)[] = [
  'id',
  'serverName',
  'databaseName',
  'isEnabled',
  'ingestedDate',
  'server',
];

@ApiBearerAuth()
@ApiTags('Database Configurations')
@Controller('database-configurations')
export class DatabaseConfigurationController {
  constructor(private readonly databaseConfigurationService: DatabaseConfigurationService) {}

  @ApiOperation({ summary: 'Get all database configurations with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(DatabaseConfigurationResponseDto, 'Successfully retrieved configurations', HttpStatus.OK)
  @ApiSortingQuery<DatabaseConfiguration>(DATABASE_CONFIGURATION_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<DatabaseConfiguration>(DATABASE_CONFIGURATION_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<DatabaseConfiguration>(DATABASE_CONFIGURATION_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<DatabaseConfiguration> | null,
    @FilteringParams<DatabaseConfiguration>(DATABASE_CONFIGURATION_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<DatabaseConfiguration> | null,
  ): Promise<PaginatedResponseDto<DatabaseConfigurationResponseDto>> {
    const { data, meta } = await this.databaseConfigurationService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Configurations Retrieved',
      'Successfully retrieved database configurations with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific database configuration by ID' })
  @ApiResponseWithData(DatabaseConfigurationResponseDto, 'Configuration retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Configuration not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<DatabaseConfigurationResponseDto>> {
    const configuration = await this.databaseConfigurationService.findOne(id);
    return ApiResponseDto.Success(
      configuration,
      'Configuration Retrieved',
      'Successfully retrieved database configuration.',
    );
  }
}
