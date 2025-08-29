import * as crypto from 'crypto';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { getWhereConditions, getSortingOrder } from '../common/helpers/typeorm-helpers';
import { Query } from '../common/entities/model/query.entity';
import { QueryResponseDto } from './dto/query-response.dto';

const QUERY_SELECT_FIELDS: (keyof Query)[] = [
  'id',
  'serverName',
  'databaseName',
  'shortDescription',
  'description',
  'statementText',
  'queryHash',
  'avgLogicalReads',
  'avgLogicalWrites',
  'avgWorkerTime',
  'avgElapsedTime',
  'executionCount',
  'lastExecutionTime',
  'ingestionTimestamp',
  'transformedTimestamp',
];

@Injectable()
export class QueryService {
  private readonly logger = new Logger(QueryService.name);

  constructor(
    @InjectRepository(Query)
    private readonly queryRepository: Repository<Query>,
  ) {}

  async getList<T extends Query>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: QueryResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams);
      const order = getSortingOrder(sortingParams);

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.queryRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: QUERY_SELECT_FIELDS,
        relations: ['application', 'application.domain'],
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
        data: plainToInstance(QueryResponseDto, data, {
          excludeExtraneousValues: false,
        }),
        meta,
      };
    } catch (error) {
      this.logger.error('An error occurred while retrieving the queries.', error);
      throw new InternalServerErrorException('An error occurred while retrieving the queries.');
    }
  }

  async findOneById(id: number): Promise<QueryResponseDto> {
    try {
      const query = await this.queryRepository.findOne({
        where: { id: id },
        select: QUERY_SELECT_FIELDS,
        relations: ['application', 'application.domain'],
      });

      if (!query) {
        this.logger.warn(`Query with ID ${id} not found.`);
        throw new NotFoundException(`Query with ID ${id} not found`);
      }

      return plainToInstance(QueryResponseDto, query, {
        excludeExtraneousValues: false,
      });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`Error retrieving query with ID ${id}:`, error);
        throw new InternalServerErrorException(`Error retrieving query with ID ${id}`);
      }
      throw error;
    }
  }

  async create(createQueryDto: CreateQueryDto): Promise<QueryResponseDto> {
    try {
      // Generate the hash based on the queryText
      const hash = crypto.createHash('sha256').update(createQueryDto.statementText).digest(); // Use SHA-256 hash

      // Truncate the hash to 8 bytes (binary(8))
      const queryHashBuffer = hash.slice(0, 8);

      const query = this.queryRepository.create({
        ...createQueryDto,
        queryHash: queryHashBuffer, // Use the generated hash
      });

      const savedQuery = await this.queryRepository.save(query);
      this.logger.log(`Successfully created query with ID ${savedQuery.id}`);

      return plainToInstance(QueryResponseDto, savedQuery, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('An error occurred while creating the query.', error);
      throw new InternalServerErrorException('An error occurred while creating the query.');
    }
  }

  async update(id: number, updateQueryDto: UpdateQueryDto): Promise<QueryResponseDto> {
    const existingQuery = await this.queryRepository.findOne({ where: { id } });

    if (!existingQuery) {
      this.logger.warn(`Query with ID ${id} not found.`);
      throw new NotFoundException(`Query with ID ${id} not found`);
    }

    Object.assign(existingQuery, updateQueryDto);
    const updatedQuery = await this.queryRepository.save(existingQuery);

    return plainToInstance(QueryResponseDto, updatedQuery, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const query = await this.queryRepository.findOne({ where: { id } });

    if (!query) {
      this.logger.warn(`Query with ID ${id} not found.`);
      throw new NotFoundException(`Query with ID ${id} not found`);
    }

    await this.queryRepository.remove(query);
    this.logger.log(`Successfully deleted query with ID ${id}`);
  }
}
