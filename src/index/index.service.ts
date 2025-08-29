import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Index } from '../common/entities/model/index.entity';
import { IndexResponseDto } from './dto/index-response.dto';
import { FilteringParam, PaginationParam, SortingParam } from '../common/decorators';
import { getWhereConditions, getSortingOrder, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';

const SELECT_FIELDS: (keyof Index)[] = [
  'id',
  'schemaName',
  'tableName',
  'indexName',
  'indexTypeDesc',
  'numberOfWrite',
  'numberOfSeeks',
  'numberOfScans',
  'serverName',
  'databaseName',
  'ingestedTimestamp',
  'transformedTimestamp',
  'table',
];

@Injectable()
export class IndexService {
  private readonly logger = new Logger(IndexService.name);

  constructor(
    @InjectRepository(Index)
    private readonly indexRepository: Repository<Index>,
  ) {}

  async getList<T extends Index>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: IndexResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams);
      const order = getSortingOrder(sortingParams);

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.indexRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: SELECT_FIELDS,
        relations: ['table'],
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
        data: plainToInstance(IndexResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<IndexResponseDto> {
    try {
      const index = await this.indexRepository.findOne({
        where: { id },
        select: SELECT_FIELDS,
        relations: ['table'],
      });

      if (!index) {
        this.logger.warn(`Index with ID ${id} not found`);
        throw new NotFoundException(`Index with ID ${id} not found`);
      }

      return plainToInstance(IndexResponseDto, index, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }

  async findIndexesByQueryId(queryId: number): Promise<IndexResponseDto[]> {
    try {
      const data = await this.indexRepository
        .createQueryBuilder('index')
        .innerJoin('index.table', 'table') // Join from Index to Table
        .innerJoin('table.queries', 'query') // Join from Table to Query
        .where('query.id = :queryId', { queryId }) // Filter by the provided queryId
        .getMany(); // Retrieve the matching indexes

      return plainToInstance(IndexResponseDto, data, { excludeExtraneousValues: true });
    } catch (error) {
      console.log('error', error);
      handleDBErrors(error);
      throw error;
    }
  }
}
