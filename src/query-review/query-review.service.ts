import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryReview } from '../common/entities/model/query-review.entity';
import { QueryReviewResponseDto } from './dto/query-review-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class QueryReviewService {
  private readonly logger = new Logger(QueryReviewService.name);

  constructor(
    @InjectRepository(QueryReview)
    private readonly queryReviewRepository: Repository<QueryReview>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<QueryReview> | null,
    filteringParams: FilteringParam<QueryReview> | null,
  ): Promise<{ data: QueryReviewResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions<QueryReview>(filteringParams);
      const order = getSortingOrder<QueryReview>(sortingParams);

      const [data, totalItems] = await this.queryReviewRepository.findAndCount({
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
        data: plainToInstance(QueryReviewResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<QueryReviewResponseDto> {
    try {
      const queryReview = await this.queryReviewRepository.findOne({
        where: { id },
        select: [
          'id',
          'queryId',
          'queryText',
          'codeLocation',
          'status',
          'hashKey',
          'performanceMetrics',
          'highlightedText',
          'recommendationId',
        ],
      });

      if (!queryReview) {
        this.logger.warn(`QueryReview with ID ${id} not found`);
        throw new NotFoundException(`QueryReview with ID ${id} not found`);
      }

      return plainToInstance(QueryReviewResponseDto, queryReview, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
