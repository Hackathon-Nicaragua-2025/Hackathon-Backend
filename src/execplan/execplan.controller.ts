import { Controller, Get, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ExecplanService } from './execplan.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { ExecPlanResponseDto } from './dto/execplan-response.dto';
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
import { ExecPlan } from '../common/entities/raw/execplan.entity';

const EXECPLAN_SORT_FILTER_FIELDS: (keyof ExecPlan)[] = [
  'id',
  'sqlText',
  'queryHash',
  'creationTime',
  'nodeId',
  'physicalOp',
  'logicalOp',
  'estimatedTotalSubtreeCost',
  'estimatedRows',
  'estimatedIO',
  'estimatedCPU',
  'parallel',
  'estimateRebinds',
  'estimateRewinds',
  'serverName',
  'databaseName',
  'ingestedTimestamp',
];

@ApiBearerAuth()
@ApiTags('Execution Plans')
@Controller('execplans')
export class ExecplanController {
  constructor(private readonly execplanService: ExecplanService) {}

  @ApiOperation({ summary: 'Get all execution plans with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(ExecPlanResponseDto, 'Successfully retrieved execution plans', HttpStatus.OK)
  @ApiSortingQuery<ExecPlan>(EXECPLAN_SORT_FILTER_FIELDS)
  @ApiFilteringQuery<ExecPlan>(EXECPLAN_SORT_FILTER_FIELDS)
  @ApiPaginationQuery()
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<ExecPlan>(EXECPLAN_SORT_FILTER_FIELDS) sortingParams: SortingParam<ExecPlan> | null,
    @FilteringParams<ExecPlan>(EXECPLAN_SORT_FILTER_FIELDS) filteringParams: FilteringParam<ExecPlan> | null,
  ): Promise<PaginatedResponseDto<ExecPlanResponseDto>> {
    const { data, meta } = await this.execplanService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Execution Plans Retrieved',
      'Successfully retrieved execution plans with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a specific execution plan by ID' })
  @ApiResponseWithData(ExecPlanResponseDto, 'Execution plan retrieved successfully', HttpStatus.OK)
  @ApiResponseWithData(null, 'Execution plan not found', HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<ExecPlanResponseDto>> {
    const execPlan = await this.execplanService.findOne(id);
    return ApiResponseDto.Success(execPlan, 'Execution Plan Retrieved', 'Successfully retrieved execution plan.');
  }
}
