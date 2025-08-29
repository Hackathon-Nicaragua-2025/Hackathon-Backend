import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, HttpCode } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { TableResponseDto } from './dto/table-response.dto';
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
import { Table } from '../common/entities/model/table.entity';
import { TableRelationResponseDto } from './dto/table-relation-response.dto';

const TABLE_SELECT_FIELDS: (keyof Table)[] = [
  'id',
  'tableName',
  'databaseName',
  'serverName',
  'rowCount',
  'sizeMb',
  'totalWrites',
  'totalUpdates',
  'totalReads',
  'totalScans',
  'transformedTimestamp',
  'database',
];

@ApiBearerAuth() // Ensure that JWT authentication is applied
@ApiTags('Table') // Tag for Swagger documentation
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @ApiOperation({ summary: 'Get all tables with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(TableResponseDto, 'Successfully retrieved all tables', HttpStatus.OK)
  @ApiResponseWithData(null, 'Unauthorized access.', HttpStatus.UNAUTHORIZED)
  @ApiResponseWithData(null, 'Invalid query parameters.', HttpStatus.BAD_REQUEST)
  @ApiResponseWithData(null, 'No tables found.', HttpStatus.NOT_FOUND)
  @ApiResponseWithData(null, 'Failed to retrieve tables.', HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiSortingQuery<Table>(TABLE_SELECT_FIELDS)
  @ApiFilteringQuery<Table>(['databaseName', 'serverName', 'tableName', 'database'])
  @ApiPaginationQuery()
  @Permissions(PermissionActions.TABLE.READ)
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<Table>(TABLE_SELECT_FIELDS)
    sortingParams: SortingParam<Table> | null,
    @FilteringParams<Table>(['databaseName', 'serverName', 'tableName', 'database'])
    filteringParams: FilteringParam<Table> | null,
  ): Promise<PaginatedResponseDto<TableResponseDto>> {
    const { data, meta } = await this.tableService.getList<Table>(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Tables Retrieved',
      'Successfully retrieved tables with pagination, filtering, and sorting.',
    );
  }

  @ApiOperation({ summary: 'Get tables by query Id' }) // Operation summary for Swagger
  @ApiResponseWithData(TableResponseDto, 'Successfully retrieved tables', HttpStatus.OK) // Response for successful retrieval
  @Permissions(PermissionActions.TABLE.READ) // Requires permission to read a specific table
  @Get('by-query/:queryId')
  async findTablesByQueryId(
    @Param('queryId', ParseIntPipe) queryId: number,
  ): Promise<ApiResponseDto<TableResponseDto[]>> {
    const data = await this.tableService.findTablesByQueryId(queryId);

    return ApiResponseDto.Success(data, 'Get table list', 'Successfully retrieved table');
  }

  @ApiOperation({ summary: 'Get tables by database Id' }) // Operation summary for Swagger
  @ApiResponseWithData(TableResponseDto, 'Successfully retrieved tables', HttpStatus.OK) // Response for successful retrieval
  @Permissions(PermissionActions.TABLE.READ) // Requires permission to read a specific table
  @Get('by-database/:databaseId')
  async findTablesByDatabaseId(
    @Param('databaseId', ParseIntPipe) databaseId: number,
  ): Promise<ApiResponseDto<TableResponseDto[]>> {
    const data = await this.tableService.findTablesByDatabaseId(databaseId);

    return ApiResponseDto.Success(data, 'Get table list', 'Successfully retrieved table');
  }

  @ApiOperation({ summary: 'Get table relations by database Id' }) // Operation summary for Swagger
  @ApiResponseWithData(TableRelationResponseDto, 'Successfully retrieved tables', HttpStatus.OK) // Response for successful retrieval
  @Permissions(PermissionActions.TABLE.READ) // Requires permission to read a specific table
  @Get('by-database/:databaseId/relations')
  async findTablesRelationsByDatabaseId(
    @Param('databaseId', ParseIntPipe) databaseId: number,
  ): Promise<ApiResponseDto<TableRelationResponseDto[]>> {
    const data = await this.tableService.findTablesRelationsByDatabaseId(databaseId);

    return ApiResponseDto.Success(data, 'Get table list', 'Successfully retrieved table');
  }

  @ApiOperation({ summary: 'Get a table by ID' }) // Operation summary for Swagger
  @ApiResponseWithData(TableResponseDto, 'Successfully retrieved table', HttpStatus.OK) // Response for successful retrieval
  @ApiResponseWithData(null, 'Table not found', HttpStatus.NOT_FOUND) // Response if the table is not found
  @Permissions(PermissionActions.TABLE.READ) // Requires permission to read a specific table
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<TableResponseDto>> {
    const table = await this.tableService.findOne(id);
    return ApiResponseDto.Success(table, 'Get Table', 'Successfully retrieved table');
  }

  @ApiOperation({ summary: 'Create a new table', deprecated: true }) // Operation summary for Swagger
  @ApiResponseWithData(TableResponseDto, 'Table successfully created', HttpStatus.CREATED) // Response for successful creation
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.TABLE.CREATE) // Requires permission to create a table
  @Post()
  async create(@Body() createTableDto: CreateTableDto) {
    const table = await this.tableService.create(createTableDto);
    return ApiResponseDto.Success(table, 'Create Table', 'Table successfully created');
  }

  @ApiOperation({ summary: 'Update a table by ID', deprecated: true }) // Operation summary for Swagger
  @ApiResponseWithData(TableResponseDto, 'Table successfully updated', HttpStatus.OK) // Response for successful update
  @ApiResponseWithData(null, 'Invalid input data', HttpStatus.BAD_REQUEST) // Response for invalid input
  @Permissions(PermissionActions.TABLE.UPDATE) // Requires permission to update a table
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateTableDto: UpdateTableDto): Promise<TableResponseDto> {
    return this.tableService.update(id, updateTableDto);
  }

  @ApiOperation({ summary: 'Delete a table by ID', deprecated: true }) // Operation summary for Swagger
  @ApiResponseWithData(null, 'Table successfully deleted', HttpStatus.NO_CONTENT) // Response for successful deletion
  @ApiResponseWithData(null, 'Table not found', HttpStatus.NOT_FOUND) // Response if the table is not found
  @Permissions(PermissionActions.TABLE.DELETE) // Requires permission to delete a table
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.tableService.remove(id);
  }
}
