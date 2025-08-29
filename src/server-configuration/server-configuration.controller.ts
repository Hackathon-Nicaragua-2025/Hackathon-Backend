import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { ServerConfigurationService } from './server-configuration.service';
import { CreateServerConfigurationDto } from './dto/create-server-configuration.dto';
import { UpdateServerConfigurationDto } from './dto/update-server-configuration.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionActions } from '../authentication/enums/authorization.enum';
import { ServerConfigurationResponseDto } from './dto/server-configuration-response.dto';
import { PaginatedResponseDto } from '../common/dto/api-paginated-response.dto';
import {
  ApiResponseWithData,
  ApiResponseWithPagination,
  ApiSortingQuery,
  FilteringParams,
  PaginationParam,
  PaginationParams,
  Permissions,
  ApiFilteringQuery,
  SortingParams,
  FilteringParam,
  SortingParam,
  ApiPaginationQuery,
} from '../common/decorators';
import { ServerConfiguration } from '../common/entities/config/server-configuration.entity';
import { TestDatabaseConnectionDto } from './dto/test-database-connection.dto';
import { TestDatabaseConnectionResponseDto } from './dto/test-database-connection-response.dto';

@ApiBearerAuth() // Ensure the controller requires JWT authentication
@Controller('server-configurations')
@ApiTags('Server Configuration')
@UseGuards(AuthGuard('jwt')) // Apply JWT authentication globally
export class ServerConfigurationController {
  constructor(private readonly serverConfigurationService: ServerConfigurationService) {}

  @ApiOperation({ summary: 'Get all server configurations with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(
    ServerConfigurationResponseDto,
    'Successfully retrieved server configurations',
    HttpStatus.OK,
  )
  @ApiResponseWithData(null, 'Unauthorized access.', HttpStatus.UNAUTHORIZED)
  @ApiResponseWithData(null, 'Invalid query parameters.', HttpStatus.BAD_REQUEST)
  @ApiResponseWithData(null, 'No server configurations found.', HttpStatus.NOT_FOUND)
  @ApiResponseWithData(null, 'Failed to retrieve server configurations.', HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiSortingQuery<ServerConfiguration>([
    'serverName',
    'ipAddress',
    'updateFrequency',
    'timeout',
    'isEnabled',
    'lastRunTime',
    'nextRunTime',
  ])
  @ApiFilteringQuery<ServerConfiguration>(['serverName', 'user', 'isEnabled'])
  @ApiPaginationQuery()
  @Permissions(PermissionActions.SERVER_CONFIGURATION.READ) // Requires permission to read server configurations
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<ServerConfiguration>([
      'serverName',
      'ipAddress',
      'updateFrequency',
      'timeout',
      'isEnabled',
      'lastRunTime',
      'nextRunTime',
    ])
    sortingParams: SortingParam<ServerConfiguration> | null,
    @FilteringParams<ServerConfiguration>(['serverName', 'user', 'isEnabled'])
    filteringParams: FilteringParam<ServerConfiguration> | null,
  ): Promise<PaginatedResponseDto<ServerConfigurationResponseDto>> {
    const { data, meta } = await this.serverConfigurationService.getList<ServerConfiguration>(
      paginationParams,
      sortingParams,
      filteringParams,
    );

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Server Configurations Retrieved',
      'Successfully retrieved server configurations with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Create a new server configuration' }) // Operation summary
  @ApiResponseWithData(ServerConfigurationResponseDto, 'Server configuration successfully created', HttpStatus.CREATED) // Success response
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Error response
  @Permissions(PermissionActions.SERVER_CONFIGURATION.CREATE) // Requires permission to create a server configuration
  @Post()
  async create(
    @Body() createServerConfigurationDto: CreateServerConfigurationDto,
  ): Promise<ApiResponseDto<ServerConfigurationResponseDto>> {
    const serverConfig = await this.serverConfigurationService.create(createServerConfigurationDto);
    return ApiResponseDto.Success(
      serverConfig,
      'Create Server Configuration',
      'Server configuration successfully created.',
    );
  }

  @ApiOperation({ summary: 'Update a server configuration by ID' }) // Operation summary
  @ApiResponseWithData(ServerConfigurationResponseDto, 'Server configuration successfully updated', HttpStatus.OK) // Success response
  @ApiResponseWithData(null, 'Server configuration not found', HttpStatus.NOT_FOUND) // Error response
  @Permissions(PermissionActions.SERVER_CONFIGURATION.UPDATE) // Requires permission to update a server configuration
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServerConfigurationDto: UpdateServerConfigurationDto,
  ): Promise<ApiResponseDto<ServerConfigurationResponseDto>> {
    const updatedConfig = await this.serverConfigurationService.update(id, updateServerConfigurationDto);
    return ApiResponseDto.Success(
      updatedConfig,
      'Update Server Configuration',
      'Server configuration successfully updated.',
    );
  }

  @ApiOperation({ summary: 'Get a server configuration by ID' }) // Operation summary
  @ApiResponseWithData(ServerConfigurationResponseDto, 'Server configuration retrieved successfully', HttpStatus.OK) // Success response
  @ApiResponseWithData(null, 'Server configuration not found', HttpStatus.NOT_FOUND) // Error response
  @Permissions(PermissionActions.SERVER_CONFIGURATION.READ) // Requires permission to read a server configuration by ID
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<ServerConfigurationResponseDto>> {
    const serverConfig = await this.serverConfigurationService.findOne(id);
    return ApiResponseDto.Success(
      serverConfig,
      'Server Configuration Retrieved',
      'Successfully retrieved server configuration.',
    );
  }

  @ApiOperation({ summary: 'Soft delete a server configuration by ID' }) // Operation summary
  @ApiResponseWithData(ServerConfigurationResponseDto, 'Server configuration successfully soft-deleted', HttpStatus.OK) // Success response
  @ApiResponseWithData(null, 'Server configuration not found', HttpStatus.NOT_FOUND) // Error response
  @Permissions(PermissionActions.SERVER_CONFIGURATION.DELETE) // Requires permission to soft delete a server configuration
  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<ServerConfigurationResponseDto>> {
    const deletedConfig = await this.serverConfigurationService.softDelete(id);
    return ApiResponseDto.Success(
      deletedConfig,
      'Soft Delete Server Configuration',
      'Server configuration successfully soft-deleted.',
    );
  }

  @ApiOperation({ summary: 'Restore a soft-deleted server configuration by ID' }) // Operation summary
  @ApiResponseWithData(ServerConfigurationResponseDto, 'Server configuration successfully restored', HttpStatus.OK) // Success response
  @ApiResponseWithData(null, 'Server configuration not found', HttpStatus.NOT_FOUND) // Error response
  @Permissions(PermissionActions.SERVER_CONFIGURATION.RESTORE) // Requires permission to restore a soft-deleted server configuration
  @Patch(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<ServerConfigurationResponseDto>> {
    const restoredConfig = await this.serverConfigurationService.restore(id);
    return ApiResponseDto.Success(
      restoredConfig,
      'Restore Server Configuration',
      'Server configuration successfully restored.',
    );
  }

  @ApiOperation({ summary: 'Test database connection for a server configuration' })
  @ApiResponseWithData(TestDatabaseConnectionResponseDto, 'Database connection tested successfully', HttpStatus.OK)
  @Post('test-connection')
  async testConnection(
    @Body() dto: TestDatabaseConnectionDto,
  ): Promise<ApiResponseDto<TestDatabaseConnectionResponseDto>> {
    const result = await this.serverConfigurationService.testDatabaseConnection(dto.serverId);
    return ApiResponseDto.Success(result, 'Test Database Connection', 'Database connection tested successfully.');
  }
}
