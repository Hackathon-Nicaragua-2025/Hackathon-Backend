import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { QueryReviewService } from './query-review.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { QueryReviewResponseDto } from './dto/query-review-response.dto';
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
import { QueryReview } from '../common/entities/model/query-review.entity';

const QUERY_REVIEW_SORT_FILTER_FIELDS: (keyof QueryReview)[] = [
  'id',
  'queryId',
  'queryText',
  'codeLocation',
  'status',
  'hashKey',
  'performanceMetrics',
  'highlightedText',
  'recommendationId',
];

@ApiBearerAuth()
@ApiTags('Query Reviews')
@Controller('query-reviews')
export class QueryReviewController {
  constructor(private readonly queryReviewService: QueryReviewService) {}

  @ApiOperation({ summary: 'Get all query reviews with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(QueryReviewResponseDto, 'Successfully retrieved query reviews', HttpStatus.OK)
  @ApiSortingQuery<QueryReview>(QUERY_REVIEW_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<QueryReview>(QUERY_REVIEW_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<QueryReview>(QUERY_REVIEW_SORT_FILTER_FIELDS) sortingParams: SortingParam<QueryReview> | null,
    @FilteringParams<QueryReview>(QUERY_REVIEW_SORT_FILTER_FIELDS) filteringParams: FilteringParam<QueryReview> | null,
  ): Promise<PaginatedResponseDto<QueryReviewResponseDto>> {
    const { data, meta } = await this.queryReviewService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Query Reviews Retrieved',
      'Successfully retrieved query reviews with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific query review by ID' })
  @ApiResponseWithData(QueryReviewResponseDto, 'Query review retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Query review not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<QueryReviewResponseDto>> {
    const queryReview = await this.queryReviewService.findOne(id);
    return ApiResponseDto.Success(queryReview, 'Query Review Retrieved', 'Successfully retrieved query review.');
  }
}
