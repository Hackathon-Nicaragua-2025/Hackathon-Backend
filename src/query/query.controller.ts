import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { QueryService } from './query.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateQueryDto } from './dto/create-query.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionActions } from '../authentication/enums/authorization.enum';
import { UpdateQueryDto } from './dto/update-query.dto';
import {
  ApiResponseWithPagination,
  ApiSortingQuery,
  ApiFilteringQuery,
  ApiPaginationQuery,
  PaginationParams,
  PaginationParam,
  SortingParams,
  SortingParam,
  FilteringParams,
  FilteringParam,
  ApiResponseWithData,
} from '../common/decorators';
import { PaginatedResponseDto } from '../common/dto/api-paginated-response.dto';
import { QueryResponseDto } from './dto/query-response.dto';
import { Query } from '../common/entities/model/query.entity';

const QUERY_SORT_FILTER_FIELDS: (keyof Query)[] = [
  'serverName',
  'databaseName',
  'statementText',
  'avgLogicalReads',
  'avgLogicalWrites',
  'avgWorkerTime',
  'avgElapsedTime',
  'executionCount',
  'lastExecutionTime',
  'ingestionTimestamp',
  'transformedTimestamp',
];

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Query')
@Controller('queries')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @ApiOperation({ summary: 'Get all queries with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(QueryResponseDto, 'Successfully retrieved queries', HttpStatus.OK)
  @ApiResponseWithData(null, 'Unauthorized access.', HttpStatus.UNAUTHORIZED)
  @ApiResponseWithData(null, 'Invalid query parameters.', HttpStatus.BAD_REQUEST)
  @ApiResponseWithData(null, 'No queries found.', HttpStatus.NOT_FOUND)
  @ApiResponseWithData(null, 'Failed to retrieve queries.', HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiSortingQuery<Query>(QUERY_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<Query>(QUERY_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Permissions(PermissionActions.QUERY.READ)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<Query>(QUERY_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<Query> | null,
    @FilteringParams<Query>(QUERY_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<Query> | null,
  ): Promise<PaginatedResponseDto<QueryResponseDto>> {
    const { data, meta } = await this.queryService.getList<Query>(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Queries Retrieved',
      'Successfully retrieved queries with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a query by ID' })
  @ApiResponseWithData(QueryResponseDto, 'Successfully retrieved query', HttpStatus.OK)
  @ApiResponseWithData(null, 'Unauthorized access.', HttpStatus.UNAUTHORIZED)
  @ApiResponseWithData(null, 'Invalid query ID.', HttpStatus.BAD_REQUEST)
  @ApiResponseWithData(null, 'Query not found.', HttpStatus.NOT_FOUND)
  @ApiResponseWithData(null, 'Failed to retrieve query.', HttpStatus.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionActions.QUERY.READ)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<QueryResponseDto>> {
    const query = await this.queryService.findOneById(id);
    return ApiResponseDto.Success(query, 'Get Query', 'Successfully retrieved query');
  }

  @ApiOperation({ summary: 'Create a new query', deprecated: true })
  @ApiResponseWithData(QueryResponseDto, 'Query successfully created', HttpStatus.CREATED)
  @ApiResponseWithData(null, 'Query not found', HttpStatus.NOT_FOUND)
  @Permissions(PermissionActions.QUERY.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createQueryDto: CreateQueryDto): Promise<ApiResponseDto<QueryResponseDto>> {
    const query = await this.queryService.create(createQueryDto);
    return ApiResponseDto.Success(query, 'Create Query', 'Query successfully created');
  }

  @ApiOperation({ summary: 'Update a query', deprecated: true })
  @ApiResponseWithData(QueryResponseDto, 'Query successfully updated', HttpStatus.OK)
  @ApiResponseWithData(null, 'Query not found', HttpStatus.NOT_FOUND)
  @Permissions(PermissionActions.QUERY.UPDATE)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQueryDto: UpdateQueryDto,
  ): Promise<ApiResponseDto<QueryResponseDto>> {
    const query = await this.queryService.update(id, updateQueryDto);
    return ApiResponseDto.Success(query, 'Update Query', 'Query successfully updated');
  }

  @ApiOperation({ summary: 'Delete a query', deprecated: true })
  @ApiResponseWithData(null, 'Query successfully deleted', HttpStatus.NO_CONTENT)
  @ApiResponseWithData(null, 'Query not found', HttpStatus.NOT_FOUND)
  @Permissions(PermissionActions.QUERY.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.queryService.delete(id);
  }
}
