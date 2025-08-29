import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParsed } from '../common/entities/model/query-parsed.entity';
import { QueryParsedResponseDto } from './dto/query-parsed-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class QueryParsedService {
  private readonly logger = new Logger(QueryParsedService.name);

  constructor(
    @InjectRepository(QueryParsed)
    private readonly queryParsedRepository: Repository<QueryParsed>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<QueryParsed> | null,
    filteringParams: FilteringParam<QueryParsed> | null,
  ): Promise<{ data: QueryParsedResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions
      const where = getWhereConditions<QueryParsed>(filteringParams);

      // Generate sorting order based on sorting parameters
      const order = getSortingOrder<QueryParsed>(sortingParams);

      // Retrieve data with pagination and sorting from the repository
      const [data, totalItems] = await this.queryParsedRepository.findAndCount({
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

      // Transform data to the response DTO
      return {
        data: plainToInstance(QueryParsedResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Log or handle database-related errors
      throw error; // Re-throw the error after handling it
    }
  }

  async findOne(id: number): Promise<QueryParsedResponseDto> {
    try {
      const queryParsed = await this.queryParsedRepository.findOne({
        where: { id },
        select: ['id', 'queryId', 'elementType', 'elementValue', 'transformedTimestamp'],
      });

      if (!queryParsed) {
        this.logger.warn(`QueryParsed with ID ${id} not found`);
        throw new NotFoundException(`QueryParsed with ID ${id} not found`);
      }

      return plainToInstance(QueryParsedResponseDto, queryParsed, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
