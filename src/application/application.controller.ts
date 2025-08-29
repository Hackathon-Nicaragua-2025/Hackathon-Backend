import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { ApplicationResponseDto } from './dto/application-response.dto';
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
import { Application } from '../common/entities/model/application.entity';
import { ApplicationStatsResponseDto } from './dto/application-stats-response.dto';

const SELECT_FIELDS: (keyof Application)[] = [
  'id',
  'applicationName',
  'isActive',
  'ingestedDate',
  'transformedTimestamp',
];
const FILTERING_FIELDS: (keyof Application)[] = ['applicationName', 'isActive'];
const SORTING_FIELDS: (keyof Application)[] = ['applicationName', 'isActive'];

@ApiBearerAuth() // Ensure that JWT authentication is applied
@ApiTags('Application') // Tag for Swagger documentation
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiOperation({ summary: 'Get all applications with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(ApplicationResponseDto, 'Successfully retrieved all applications', HttpStatus.OK)
  @ApiSortingQuery<Application>(SORTING_FIELDS)
  @ApiFilteringQuery<Application>(FILTERING_FIELDS)
  @ApiPaginationQuery()
  @Permissions(PermissionActions.QUERY.READ)
  @Get()
  async findAll(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<Application>(SELECT_FIELDS)
    sortingParams: SortingParam<Application> | null,
    @FilteringParams<Application>(FILTERING_FIELDS)
    filteringParams: FilteringParam<Application> | null,
  ): Promise<PaginatedResponseDto<ApplicationResponseDto>> {
    const { data, meta } = await this.applicationService.findAll<Application>(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Applications Retrieved',
      'Successfully retrieved applications with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get a application stats' }) // Operation summary for Swagger
  @ApiResponseWithData(ApplicationStatsResponseDto, 'Successfully retrieved application stats', HttpStatus.OK) // Response for successful retrieval
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @Get('stats')
  async getApplicationStats(): Promise<ApiResponseDto<ApplicationStatsResponseDto[]>> {
    const data = await this.applicationService.getApplicationStats();
    return ApiResponseDto.Success(data, 'Get application stats', 'Successfully retrieved');
  }

  @ApiOperation({ summary: 'Get a application by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(ApplicationResponseDto, 'Successfully retrieved application', HttpStatus.OK) // Response for successful retrieval
  @ApiResponseWithData(null, 'Application not found', HttpStatus.NOT_FOUND) // Response if the record is not found
  @Permissions(PermissionActions.QUERY.READ) // Requires permission to read a specific record
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<ApplicationResponseDto>> {
    const application = await this.applicationService.findOne(id);
    return ApiResponseDto.Success(application, 'Get application', 'Successfully retrieved');
  }

  @ApiOperation({ summary: 'Create a new application' }) // Operation summary for Swagger
  @ApiResponseWithData(ApplicationResponseDto, 'Application successfully created', HttpStatus.CREATED) // Response for successful creation
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.QUERY.CREATE) // Requires permission to create a record
  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    const application = await this.applicationService.create(createApplicationDto);
    return ApiResponseDto.Success(application, 'Create application', 'Application successfully created');
  }

  @ApiOperation({ summary: 'Update a application by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(ApplicationResponseDto, 'Table successfully updated', HttpStatus.OK) // Response for successful update
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.QUERY.UPDATE) // Requires permission to update a record
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @ApiOperation({ summary: 'Delete a application by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(null, 'Application successfully deleted', HttpStatus.NO_CONTENT) // Response for successful deletion
  @ApiResponseWithData(null, 'Application not found', HttpStatus.NOT_FOUND) // Response if the record is not found
  @Permissions(PermissionActions.QUERY.DELETE) // Requires permission to delete a record
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.applicationService.remove(id);
  }
}
