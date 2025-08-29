import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableReviewResponseDto } from './dto/table-review.response.dto';
import { TableReview } from '../common/entities/model/table-review.entity';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TableReviewService {
  private readonly logger = new Logger(TableReviewService.name);

  constructor(
    @InjectRepository(TableReview)
    private readonly tableReviewRepository: Repository<TableReview>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<TableReview> | null,
    filteringParams: FilteringParam<TableReview> | null,
  ): Promise<{ data: TableReviewResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions<TableReview>(filteringParams);

      const order = getSortingOrder<TableReview>(sortingParams);

      const [data, totalItems] = await this.tableReviewRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
      });

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
        data: plainToInstance(TableReviewResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<TableReviewResponseDto> {
    try {
      const tableReview = await this.tableReviewRepository.findOne({
        where: { tableId: id },
        select: [
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
          'queryList',
          'indexes',
          'dependencies',
          'recommendations',
          'lastRunTime',
          'nextRunTime',
        ],
      });

      if (!tableReview) {
        this.logger.warn(`TableReview with ID ${id} not found`);
        throw new NotFoundException(`TableReview with ID ${id} not found`);
      }

      return plainToInstance(TableReviewResponseDto, tableReview, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
