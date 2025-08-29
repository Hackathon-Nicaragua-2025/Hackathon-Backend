import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { QueryParsedService } from './query-parsed.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { QueryParsedResponseDto } from './dto/query-parsed-response.dto';
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
import { QueryParsed } from '../common/entities/model/query-parsed.entity';

const QUERY_PARSED_SORT_FILTER_FIELDS: (keyof QueryParsed)[] = [
  'id',
  'queryId',
  'elementType',
  'elementValue',
  'transformedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Query Parsed')
@Controller('query-parsed')
export class QueryParsedController {
  constructor(private readonly queryParsedService: QueryParsedService) {}

  @ApiOperation({ summary: 'Get all parsed query records with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(QueryParsedResponseDto, 'Successfully retrieved parsed query records', HttpStatus.OK)
  @ApiSortingQuery<QueryParsed>(QUERY_PARSED_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<QueryParsed>(QUERY_PARSED_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<QueryParsed>(QUERY_PARSED_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<QueryParsed> | null,
    @FilteringParams<QueryParsed>(QUERY_PARSED_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<QueryParsed> | null,
  ): Promise<PaginatedResponseDto<QueryParsedResponseDto>> {
    const { data, meta } = await this.queryParsedService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Parsed Query Records Retrieved',
      'Successfully retrieved parsed query records with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific parsed query record by ID' })
  @ApiResponseWithData(QueryParsedResponseDto, 'Parsed query record retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Parsed query record not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<QueryParsedResponseDto>> {
    const queryParsed = await this.queryParsedService.findOne(id);
    return ApiResponseDto.Success(
      queryParsed,
      'Parsed Query Record Retrieved',
      'Successfully retrieved parsed query record.',
    );
  }
}
