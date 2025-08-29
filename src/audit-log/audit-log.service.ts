import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../common/entities/app/audit-log.entity';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { getWhereConditions, getSortingOrder } from '../common/helpers/typeorm-helpers';
import { AuditLogResponseDto } from './dto/audit-log-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async getList<T extends AuditLog>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: AuditLogResponseDto[]; meta: PaginatedMetaDto }> {
    // Apply filtering and sorting conditions
    const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
    const order = getSortingOrder(sortingParams); // Apply sorting order based on T

    // Fetch data with pagination, sorting, and filtering
    const [data, totalItems] = await this.auditLogRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: (page - 1) * limit,
    });

    // Calculate pagination metadata
    const pageCount = Math.ceil(totalItems / limit);
    const meta: PaginatedMetaDto = {
      page,
      take: limit,
      itemCount: totalItems,
      pageCount,
      hasPreviousPage: page > 1,
      hasNextPage: page < pageCount,
    };

    return {
      data: plainToInstance(AuditLogResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }
}
