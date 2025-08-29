import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { RecommendationListService } from './recommendation-list.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { RecommendationListResponseDto } from './dto/recommendation-list-response.dto';
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
import { RecommendationList } from '../common/entities/config/recommendation-list.entity';

const RECOMMENDATION_LIST_SORT_FILTER_FIELDS: (keyof RecommendationList)[] = [
  'id',
  'recommendationTitle',
  'recommendationDefinition',
  'recommendationType',
];

@ApiBearerAuth()
@ApiTags('Recommendation Lists')
@Controller('recommendation-lists')
export class RecommendationListController {
  constructor(private readonly recommendationListService: RecommendationListService) {}

  @ApiOperation({ summary: 'Get all recommendations with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(RecommendationListResponseDto, 'Successfully retrieved recommendations', HttpStatus.OK)
  @ApiSortingQuery<RecommendationList>(RECOMMENDATION_LIST_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<RecommendationList>(RECOMMENDATION_LIST_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<RecommendationList>(RECOMMENDATION_LIST_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<RecommendationList> | null,
    @FilteringParams<RecommendationList>(RECOMMENDATION_LIST_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<RecommendationList> | null,
  ): Promise<PaginatedResponseDto<RecommendationListResponseDto>> {
    const { data, meta } = await this.recommendationListService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Recommendations Retrieved',
      'Successfully retrieved recommendations with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific recommendation by ID' })
  @ApiResponseWithData(RecommendationListResponseDto, 'Recommendation retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Recommendation not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<RecommendationListResponseDto>> {
    const recommendation = await this.recommendationListService.findOne(id);
    return ApiResponseDto.Success(recommendation, 'Recommendation Retrieved', 'Successfully retrieved recommendation.');
  }
}
