import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { TableReviewService } from './table_review.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { TableReviewResponseDto } from './dto/table-review.response.dto';
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
import { TableReview } from '../common/entities/model/table-review.entity';

const TABLE_REVIEW_SORT_FILTER_FIELDS: (keyof TableReview)[] = [
  'tableId',
  'week',
  'tableName',
  'rowCount',
  'sizeMb',
  'reads',
  'scans',
  'seeks',
  'writes',
  'updates',
  'lastRunTime',
  'nextRunTime',
];

@ApiBearerAuth()
@ApiTags('Table Review')
@Controller('table-reviews')
export class TableReviewController {
  constructor(private readonly tableReviewService: TableReviewService) {}

  @ApiOperation({ summary: 'Get all table reviews with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(TableReviewResponseDto, 'Successfully retrieved table reviews', HttpStatus.OK)
  @ApiSortingQuery<TableReview>(TABLE_REVIEW_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<TableReview>(TABLE_REVIEW_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<TableReview>(TABLE_REVIEW_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<TableReview> | null,
    @FilteringParams<TableReview>(TABLE_REVIEW_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<TableReview> | null,
  ): Promise<PaginatedResponseDto<TableReviewResponseDto>> {
    const { data, meta } = await this.tableReviewService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Table Reviews Retrieved',
      'Successfully retrieved table reviews with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific table review by ID' })
  @ApiResponseWithData(TableReviewResponseDto, 'Table review retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Table review not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<TableReviewResponseDto>> {
    const tableReview = await this.tableReviewService.findOne(id);
    return ApiResponseDto.Success(tableReview, 'Table Review Retrieved', 'Successfully retrieved table review.');
  }
}
