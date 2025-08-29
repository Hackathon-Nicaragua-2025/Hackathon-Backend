import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { MissingIndexService } from './missing-index.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { MissingIndexResponseDto } from './dto/missing-index-response.dto';
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
import { MissingIndex } from '../common/entities/raw/missing-index.entity';

const MISSING_INDEX_SORT_FILTER_FIELDS: (keyof MissingIndex)[] = [
  'id',
  'databaseName',
  'schemaName',
  'tableName',
  'sqlText',
  'statementId',
  'usecounts',
  'refcounts',
  'impact',
  'equalityColumns',
  'inequalityColumns',
  'includeColumns',
  'queryPlan',
  'planHandle',
  'serverName',
  'databaseNam',
  'ingestedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Missing Indexes')
@Controller('missing-indexes')
export class MissingIndexController {
  constructor(private readonly missingIndexService: MissingIndexService) {}

  @ApiOperation({ summary: 'Get all missing indexes with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(MissingIndexResponseDto, 'Successfully retrieved missing indexes', HttpStatus.OK)
  @ApiSortingQuery<MissingIndex>(MISSING_INDEX_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<MissingIndex>(MISSING_INDEX_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<MissingIndex>(MISSING_INDEX_SORT_FILTER_FIELDS) sortingParams: SortingParam<MissingIndex> | null,
    @FilteringParams<MissingIndex>(MISSING_INDEX_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<MissingIndex> | null,
  ): Promise<PaginatedResponseDto<MissingIndexResponseDto>> {
    const { data, meta } = await this.missingIndexService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Missing Indexes Retrieved',
      'Successfully retrieved missing indexes with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific missing index by ID' })
  @ApiResponseWithData(MissingIndexResponseDto, 'Missing index retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Missing index not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<MissingIndexResponseDto>> {
    const missingIndex = await this.missingIndexService.findOne(id);
    return ApiResponseDto.Success(missingIndex, 'Missing Index Retrieved', 'Successfully retrieved missing index.');
  }
}
