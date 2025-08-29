import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CreateTableRecommendationDto } from './dto/create-table-recommendation.dto';
import { UpdateTableRecommendationDto } from './dto/update-table-recommendation.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { RecommendationTableResponseDto } from './dto/table-recommendation-response.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { TableRecommendationService } from './table-recommendation.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionActions } from '../authentication/enums/authorization.enum';
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
import { RecommendationTable } from '../common/entities/model/recommendation-table.entity';

@ApiBearerAuth() // Ensure that JWT authentication is applied
@ApiTags('Table Recommendation') // Tag for Swagger documentation
@Controller('table-recommendations')
export class TableRecommendationController {
  constructor(private readonly tableRecommendationService: TableRecommendationService) {}

  @ApiOperation({ summary: 'Get all table recommendations with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(RecommendationTableResponseDto, 'Successfully retrieved recommendations', HttpStatus.OK)
  @ApiResponseWithData(null, 'Unauthorized access.', HttpStatus.UNAUTHORIZED)
  @ApiResponseWithData(null, 'Invalid query parameters.', HttpStatus.BAD_REQUEST)
  @ApiResponseWithData(null, 'No recommendations found.', HttpStatus.NOT_FOUND)
  @ApiResponseWithData(null, 'Failed to retrieve recommendations.', HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiSortingQuery<RecommendationTable>(['summary', 'impact', 'status'])
  @ApiFilteringQuery<RecommendationTable>(['summary', 'impact', 'status'])
  @ApiPaginationQuery()
  @Permissions(PermissionActions.TABLE_RECOMMENDATION.READ)
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<RecommendationTable>(['summary', 'impact', 'status'])
    sortingParams: SortingParam<RecommendationTable> | null,
    @FilteringParams<RecommendationTable>(['summary', 'impact', 'status'])
    filteringParams: FilteringParam<RecommendationTable> | null,
  ): Promise<PaginatedResponseDto<RecommendationTableResponseDto>> {
    const { data, meta } = await this.tableRecommendationService.getList<RecommendationTable>(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Recommendations Retrieved',
      'Successfully retrieved table recommendations with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Create a new recommendation' })
  @ApiResponseWithData(RecommendationTableResponseDto, 'Recommendation successfully created', HttpStatus.CREATED)
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST)
  @Permissions(PermissionActions.TABLE_RECOMMENDATION.CREATE)
  @Post()
  async create(
    @Body() createTableRecommendationDto: CreateTableRecommendationDto,
  ): Promise<ApiResponseDto<RecommendationTableResponseDto>> {
    const recommendation = await this.tableRecommendationService.create(createTableRecommendationDto);
    return ApiResponseDto.Success(recommendation, 'Create Recommendation', 'Recommendation successfully created');
  }

  @ApiOperation({ summary: 'Get a recommendation by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(RecommendationTableResponseDto, 'Successfully retrieved recommendation', HttpStatus.OK) // Response for successful retrieval
  @ApiResponseWithData(null, 'Recommendation not found', HttpStatus.NOT_FOUND) // Response if the recommendation is not found
  @Permissions(PermissionActions.TABLE_RECOMMENDATION.READ) // Requires permission to read a specific recommendation
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<RecommendationTableResponseDto>> {
    const recommendation = await this.tableRecommendationService.findOne(id);
    return ApiResponseDto.Success(recommendation, 'Get Recommendation', 'Successfully retrieved recommendation');
  }

  @ApiOperation({ summary: 'Update a recommendation by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(RecommendationTableResponseDto, 'Recommendation successfully updated', HttpStatus.OK) // Response for successful update
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.TABLE_RECOMMENDATION.UPDATE) // Requires permission to update a recommendation
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTableRecommendationDto: UpdateTableRecommendationDto,
  ): Promise<RecommendationTableResponseDto> {
    return this.tableRecommendationService.update(id, updateTableRecommendationDto);
  }

  @ApiOperation({ summary: 'Delete a recommendation by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(null, 'Recommendation successfully deleted', HttpStatus.NO_CONTENT) // Response for successful deletion
  @ApiResponseWithData(null, 'Recommendation not found', HttpStatus.NOT_FOUND) // Response if the recommendation is not found
  @Permissions(PermissionActions.TABLE_RECOMMENDATION.DELETE) // Requires permission to delete a recommendation
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.tableRecommendationService.delete(id);
  }
}
