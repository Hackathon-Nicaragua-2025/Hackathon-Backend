import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLog } from '../common/entities/app/audit-log.entity';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionActions } from '../authentication/enums/authorization.enum';
import { PermissionsGuard } from '../common/guards/permission.guard';
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
import { AuditLogResponseDto } from './dto/audit-log-response.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiTags('Audit Log')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @ApiOperation({ summary: 'Get all audit logs with pagination, filtering, and sorting' })
  @ApiResponseWithPagination(AuditLog, 'Successfully retrieved audit logs', HttpStatus.OK)
  @ApiSortingQuery<AuditLog>(['id', 'entityType', 'entityId', 'actionType', 'actionBy', 'actionAt'])
  @ApiFilteringQuery<AuditLog>(['id', 'entityType', 'entityId', 'actionType', 'actionBy', 'actionAt'])
  @ApiPaginationQuery()
  @Permissions(PermissionActions.AUDIT_LOG.READ) // Ensure the user has permission to read audit logs
  @HttpCode(HttpStatus.OK)
  @Get()
  async getList(
    @PaginationParams() paginationParams: PaginationParam,
    @SortingParams<AuditLog>(['id', 'entityType', 'entityId', 'actionType', 'actionBy', 'actionAt'])
    sortingParams: SortingParam<AuditLog> | null,
    @FilteringParams<AuditLog>(['id', 'entityType', 'entityId', 'actionType', 'actionBy', 'actionAt'])
    filteringParams: FilteringParam<AuditLog> | null,
  ): Promise<PaginatedResponseDto<AuditLogResponseDto>> {
    const { data, meta } = await this.auditLogService.getList(paginationParams, sortingParams, filteringParams);

    return PaginatedResponseDto.PaginatedSuccess(
      data,
      meta,
      'Audit Logs Retrieved',
      'Successfully retrieved audit logs with pagination, filtering, and sorting.',
    );
  }
}
