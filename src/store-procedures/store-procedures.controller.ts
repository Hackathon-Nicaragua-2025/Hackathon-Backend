import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { StoreProceduresService } from './store-procedures.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { StoreProceduresResponseDto } from './dto/store-procedures-response.dto';
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
import { StoreProcedures } from '../common/entities/raw/store-procedures.entity';

const STORE_PROCEDURE_SORT_FILTER_FIELDS: (keyof StoreProcedures)[] = [
  'id',
  'procedureName',
  'procedureDefinition',
  'serverName',
  'databaseNam',
  'ingestedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Store Procedures')
@Controller('store-procedures')
export class StoreProceduresController {
  constructor(private readonly storeProceduresService: StoreProceduresService) {}

  @ApiOperation({ summary: 'Get all store procedures with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(StoreProceduresResponseDto, 'Successfully retrieved store procedures', HttpStatus.OK)
  @ApiSortingQuery<StoreProcedures>(STORE_PROCEDURE_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<StoreProcedures>(STORE_PROCEDURE_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<StoreProcedures>(STORE_PROCEDURE_SORT_FILTER_FIELDS)
    sortingParams: SortingParam<StoreProcedures> | null,
    @FilteringParams<StoreProcedures>(STORE_PROCEDURE_SORT_FILTER_FIELDS)
    filteringParams: FilteringParam<StoreProcedures> | null,
  ): Promise<PaginatedResponseDto<StoreProceduresResponseDto>> {
    const { data, meta } = await this.storeProceduresService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Store Procedures Retrieved',
      'Successfully retrieved store procedures with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific store procedure by ID' })
  @ApiResponseWithData(StoreProceduresResponseDto, 'Store procedure retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Store procedure not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<StoreProceduresResponseDto>> {
    const storeProcedure = await this.storeProceduresService.findOne(id);
    return ApiResponseDto.Success(
      storeProcedure,
      'Store Procedure Retrieved',
      'Successfully retrieved store procedure.',
    );
  }
}
