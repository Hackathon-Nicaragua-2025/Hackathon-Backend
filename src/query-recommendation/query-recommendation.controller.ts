import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryRecommendationService } from './query-recommendation.service';
import { CreateRecommendationQueryDto } from './dto/create-query-recommendation.dto';
import { RecommendationQueryResponseDto } from './dto/query-recommendation-response.dto';
import { UpdateRecommendationDto } from './dto/update-query-recommendation.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionActions } from '../authentication/enums/authorization.enum';
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
} from '../common/decorators';
import { PaginatedResponseDto } from '../common/dto/api-paginated-response.dto';
import { RecommendationQuery } from '../common/entities/model/query-recommendation.entity';

@ApiBearerAuth() // Ensure that JWT authentication is applied
@UseGuards(AuthGuard('jwt')) // Apply JWT guard globally
@ApiTags('Query Recommendation')
@Controller('query-recommendations')
export class QueryRecommendationController {
  constructor(private readonly recommendationService: QueryRecommendationService) {}

  @ApiOperation({ summary: 'Get all recommendations with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(RecommendationQueryResponseDto, 'Successfully retrieved recommendations', HttpStatus.OK)
  @ApiResponseWithData(null, 'Unauthorized access.', HttpStatus.UNAUTHORIZED)
  @ApiResponseWithData(null, 'Invalid query parameters.', HttpStatus.BAD_REQUEST)
  @ApiResponseWithData(null, 'No recommendations found.', HttpStatus.NOT_FOUND)
  @ApiResponseWithData(null, 'Failed to retrieve recommendations.', HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiSortingQuery<RecommendationQuery>(['summary', 'impact', 'status'])
  @ApiFilteringQuery<RecommendationQuery>(['summary', 'impact', 'status', 'query'])
  @ApiPaginationQuery()
  @Permissions(PermissionActions.QUERY_RECOMMENDATION.READ)
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<RecommendationQuery>(['summary', 'impact', 'status'])
    sortingParams: SortingParam<RecommendationQuery> | null,
    @FilteringParams<RecommendationQuery>(['summary', 'impact', 'status', 'query'])
    filteringParams: FilteringParam<RecommendationQuery> | null,
  ): Promise<PaginatedResponseDto<RecommendationQueryResponseDto>> {
    const { data, meta } = await this.recommendationService.getList<RecommendationQuery>(
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a recommendation by ID' }) // Summary of the operation
  @ApiResponseWithData(RecommendationQueryResponseDto, 'Successfully retrieved recommendation', HttpStatus.OK) // Response for success
  @ApiResponseWithData(null, 'Recommendation not found', HttpStatus.NOT_FOUND)
  @Permissions(PermissionActions.QUERY_RECOMMENDATION.READ) // Requires READ permission to access a specific recommendation
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<RecommendationQueryResponseDto>> {
    const recommendation = await this.recommendationService.findOne(id);
    return ApiResponseDto.Success(recommendation, 'Get Recommendation', 'Successfully retrieved recommendation');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new recommendation' }) // Summary of the operation
  @ApiResponseWithData(RecommendationQueryResponseDto, 'Recommendation successfully created', HttpStatus.CREATED) // Response for successful creation
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.QUERY_RECOMMENDATION.CREATE) // Requires CREATE permission to create a new recommendation
  async create(
    @Body() createRecommendationDto: CreateRecommendationQueryDto,
  ): Promise<ApiResponseDto<RecommendationQueryResponseDto>> {
    const recommendation = await this.recommendationService.create(createRecommendationDto);
    return ApiResponseDto.Success(recommendation, 'Create Recommendation', 'Recommendation successfully created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update recommendation' }) // Summary of the operation
  @ApiResponseWithData(RecommendationQueryResponseDto, 'Recommendation successfully updated', HttpStatus.OK) // Response for successful update
  @ApiResponseWithData(null, 'Recommendation not found', HttpStatus.NOT_FOUND) // Response if the recommendation is not found
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionActions.QUERY_RECOMMENDATION.UPDATE) // Requires UPDATE permission to modify a recommendation
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateRecommendationDto,
  ): Promise<RecommendationQueryResponseDto> {
    return await this.recommendationService.update(id, updateDto);
  }

  @Delete(':id/unlink')
  @Permissions(PermissionActions.QUERY_RECOMMENDATION.UNLINK) // Requires UNLINK permission to unlink a recommendation
  @ApiOperation({ summary: 'Unlink a recommendation from a query' }) // Summary of the operation
  @ApiResponseWithData(null, 'Recommendation successfully unlinked', HttpStatus.NO_CONTENT) // Response for successful unlink
  @ApiResponseWithData(null, 'Recommendation not found or already unlinked', HttpStatus.NOT_FOUND) // Response if not found
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlink(@Param('id') id: number): Promise<void> {
    await this.recommendationService.unlinkRecommendation(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete recommendation' }) // Summary of the operation
  @ApiResponseWithData(null, 'Recommendation successfully deleted', HttpStatus.NO_CONTENT) // Response for successful delete
  @ApiResponseWithData(null, 'Recommendation not found', HttpStatus.NOT_FOUND) // Response if the recommendation is not found
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PermissionActions.QUERY_RECOMMENDATION.DELETE) // Requires DELETE permission to remove a recommendation
  async delete(@Param('id') id: number): Promise<void> {
    await this.recommendationService.delete(id);
  }
}
