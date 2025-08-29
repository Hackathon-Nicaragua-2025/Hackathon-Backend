import { Controller, Get, Param, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { IndexService } from './index.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { IndexResponseDto } from './dto/index-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResponseDto } from '../common/dto/api-paginated-response.dto';
import {
  ApiResponseWithData,
  ApiResponseWithPagination,
  ApiSortingQuery,
  FilteringParams,
  PaginationParam,
  PaginationParams,
  ApiFilteringQuery,
  SortingParams,
  FilteringParam,
  SortingParam,
  ApiPaginationQuery,
} from '../common/decorators';
import { Index } from '../common/entities/model/index.entity';

// Define a constant for sorting and filtering fields to avoid repetition
const INDEX_SORT_FILTER_FIELDS: (keyof Index)[] = [
  'id',
  'schemaName',
  'tableName',
  'indexName',
  'indexTypeDesc',
  'numberOfWrite',
  'numberOfSeeks',
  'numberOfScans',
  'serverName',
  'databaseName',
  'ingestedTimestamp',
  'transformedTimestamp',
  'table',
];

@ApiBearerAuth() // Ensure the controller requires JWT authentication
@Controller('indexes')
@ApiTags('Index')
@UseGuards(AuthGuard('jwt')) // Apply JWT authentication globally
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @ApiOperation({ summary: 'Get all indexes with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(IndexResponseDto, 'Successfully retrieved indexes', HttpStatus.OK)
  @ApiSortingQuery<Index>(INDEX_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<Index>(INDEX_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<Index>(INDEX_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<Index> | null,
    @FilteringParams<Index>(INDEX_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<Index> | null,
  ): Promise<PaginatedResponseDto<IndexResponseDto>> {
    const { data, meta } = await this.indexService.getList<Index>(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Indexes Retrieved',
      'Successfully retrieved indexes with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get indexes by query Id' }) // Operation summary for Swagger
  @ApiResponseWithData(IndexResponseDto, 'Successfully retrieved tables', HttpStatus.OK) // Response for successful retrieval
  @Get('by-query/:queryId')
  async findIndexesByQueryId(
    @Param('queryId', ParseIntPipe) queryId: number,
  ): Promise<ApiResponseDto<IndexResponseDto[]>> {
    const data = await this.indexService.findIndexesByQueryId(queryId);

    return ApiResponseDto.Success(data, 'Get index list', 'Successfully retrieved index');
  }

  @ApiOperation({ summary: 'Get a specific index by ID' })
  @ApiResponseWithData(IndexResponseDto, 'Index retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Index not found', HttpStatus.NOT_FOUND)
  @ApiParam({ name: 'id', type: Number, description: 'ID of the index' })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<IndexResponseDto>> {
    const index = await this.indexService.findOne(id);
    return ApiResponseDto.Success(index, 'Index Retrieved', 'Successfully retrieved index.');
  }
}
