import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { DomainResponseDto } from './dto/domain-response.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
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
import { Domain } from '../common/entities/model/domain.entity';
import { DomainStatsResponseDto } from './dto/domain-stats-response.dto';

const SELECT_FIELDS: (keyof Domain)[] = ['id', 'domainName', 'isActive', 'ingestedDate', 'transformedTimestamp'];
const FILTERING_FIELDS: (keyof Domain)[] = ['domainName', 'isActive'];
const SORTING_FIELDS: (keyof Domain)[] = ['domainName', 'isActive'];

@ApiBearerAuth() // Ensure that JWT authentication is applied
@ApiTags('Domain') // Tag for Swagger documentation
@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @ApiOperation({ summary: 'Get all domains with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(DomainResponseDto, 'Successfully retrieved all domains', HttpStatus.OK)
  @ApiSortingQuery<Domain>(SORTING_FIELDS)
  @ApiFilteringQuery<Domain>(FILTERING_FIELDS)
  @ApiPaginationQuery()
  @Permissions(PermissionActions.QUERY.READ)
  @Get()
  async findAll(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<Domain>(SELECT_FIELDS)
    sortingParams: SortingParam<Domain> | null,
    @FilteringParams<Domain>(FILTERING_FIELDS)
    filteringParams: FilteringParam<Domain> | null,
  ): Promise<PaginatedResponseDto<DomainResponseDto>> {
    const { data, meta } = await this.domainService.findAll<Domain>(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Domains Retrieved',
      'Successfully retrieved domains with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a domain stats' }) // Operation summary for Swagger
  @ApiResponseWithData(DomainStatsResponseDto, 'Successfully retrieved domain stats', HttpStatus.OK) // Response for successful retrieval
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @Get('stats')
  async getApplicationStats(): Promise<ApiResponseDto<DomainStatsResponseDto[]>> {
    const data = await this.domainService.getDomainStats();
    return ApiResponseDto.Success(data, 'Get domain stats', 'Successfully retrieved');
  }

  @ApiOperation({ summary: 'Get a domain by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(DomainResponseDto, 'Successfully retrieved domain', HttpStatus.OK) // Response for successful retrieval
  @ApiResponseWithData(null, 'Domain not found', HttpStatus.NOT_FOUND) // Response if the table is not found
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific table
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<DomainResponseDto>> {
    const domain = await this.domainService.findOne(id);
    return ApiResponseDto.Success(domain, 'Get Domain', 'Successfully retrieved');
  }

  @ApiOperation({ summary: 'Create a new domain' }) // Operation summary for Swagger
  @ApiResponseWithData(DomainResponseDto, 'Domain successfully created', HttpStatus.CREATED) // Response for successful creation
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.QUERY.CREATE) // Requires permission to create a table
  @Post()
  async create(@Body() createDomainDto: CreateDomainDto) {
    const domain = await this.domainService.create(createDomainDto);
    return ApiResponseDto.Success(domain, 'Create Domain', 'Domain successfully created');
  }

  @ApiOperation({ summary: 'Update a domain by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(DomainResponseDto, 'Table successfully updated', HttpStatus.OK) // Response for successful update
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.QUERY.UPDATE) // Requires permission to update a table
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDomainDto: UpdateDomainDto): Promise<DomainResponseDto> {
    return this.domainService.update(id, updateDomainDto);
  }

  @ApiOperation({ summary: 'Delete a domain by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(null, 'Domain successfully deleted', HttpStatus.NO_CONTENT) // Response for successful deletion
  @ApiResponseWithData(null, 'Domain not found', HttpStatus.NOT_FOUND) // Response if the table is not found
  @Permissions(PermissionActions.QUERY.DELETE) // Requires permission to delete a table
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.domainService.remove(id);
  }
}
