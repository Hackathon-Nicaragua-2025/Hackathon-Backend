import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { QueryExecutionService } from './query_execution.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { QueryExecutionResponseDto } from './dto/query-execution.response.dto';
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
import { QueryExecution } from '../common/entities/model/query-execution.entity';

const QUERY_EXECUTION_SORT_FILTER_FIELDS: (keyof QueryExecution)[] = [
  'id',
  'queryId',
  'databaseName',
  'creationTime',
  'lastExecutionTime',
  'executionCount',
  'cpuTime',
  'elapsedTime',
  'logicalReads',
  'logicalWrites',
  'serverName',
  'transformedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Query Execution')
@Controller('query-executions')
export class QueryExecutionController {
  constructor(private readonly queryExecutionService: QueryExecutionService) {}

  @ApiOperation({ summary: 'Get all query executions with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(QueryExecutionResponseDto, 'Successfully retrieved query executions', HttpStatus.OK)
  @ApiSortingQuery<QueryExecution>(QUERY_EXECUTION_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<QueryExecution>(QUERY_EXECUTION_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<QueryExecution>(QUERY_EXECUTION_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<QueryExecution> | null,
    @FilteringParams<QueryExecution>(QUERY_EXECUTION_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<QueryExecution> | null,
  ): Promise<PaginatedResponseDto<QueryExecutionResponseDto>> {
    const { data, meta } = await this.queryExecutionService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Query Executions Retrieved',
      'Successfully retrieved query executions with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific query execution by ID' })
  @ApiResponseWithData(QueryExecutionResponseDto, 'Query execution retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Query execution not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<QueryExecutionResponseDto>> {
    const queryExecution = await this.queryExecutionService.findOne(id);
    return ApiResponseDto.Success(
      queryExecution,
      'Query Execution Retrieved',
      'Successfully retrieved query execution.',
    );
  }
}
