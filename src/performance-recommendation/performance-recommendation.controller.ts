import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PerformanceRecommendationService } from './performance-recommendation.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { PerformanceRecommendationResponseDto } from './dto/performance-recommendation-response.dto';
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
import { PerformanceRecommendation } from '../common/entities/aggmodel/performance-recommendation.entity';

const PERFORMANCE_RECOMMENDATION_SORT_FILTER_FIELDS: (keyof PerformanceRecommendation)[] = [
  'id',
  'aggId',
  'recommendationText',
  'recommendationType',
  'impactEstimation',
  'status',
  'implementationDate',
];

@ApiBearerAuth()
@ApiTags('Performance Recommendations')
@Controller('performance-recommendations')
export class PerformanceRecommendationController {
  constructor(private readonly performanceRecommendationService: PerformanceRecommendationService) {}

  @ApiOperation({ summary: 'Get all performance recommendations with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(
    PerformanceRecommendationResponseDto,
    'Successfully retrieved performance recommendations',
    HttpStatus.OK,
  )
  @ApiSortingQuery<PerformanceRecommendation>(PERFORMANCE_RECOMMENDATION_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<PerformanceRecommendation>(PERFORMANCE_RECOMMENDATION_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<PerformanceRecommendation>(PERFORMANCE_RECOMMENDATION_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<PerformanceRecommendation> | null,
    @FilteringParams<PerformanceRecommendation>(PERFORMANCE_RECOMMENDATION_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<PerformanceRecommendation> | null,
  ): Promise<PaginatedResponseDto<PerformanceRecommendationResponseDto>> {
    const { data, meta } = await this.performanceRecommendationService.getList(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Performance Recommendations Retrieved',
      'Successfully retrieved performance recommendations with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific performance recommendation by ID' })
  @ApiResponseWithData(
    PerformanceRecommendationResponseDto,
    'Performance recommendation retrieved successfully',
    HttpStatus.OK,
  )
  @ApiResponseWithData(null, 'Performance recommendation not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<PerformanceRecommendationResponseDto>> {
    const recommendation = await this.performanceRecommendationService.findOne(id);
    return ApiResponseDto.Success(
      recommendation,
      'Performance Recommendation Retrieved',
      'Successfully retrieved performance recommendation.',
    );
  }
}
