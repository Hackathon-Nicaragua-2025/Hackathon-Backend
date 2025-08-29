import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissingIndex } from '../common/entities/raw/missing-index.entity';
import { MissingIndexResponseDto } from './dto/missing-index-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MissingIndexService {
  private readonly logger = new Logger(MissingIndexService.name);

  constructor(
    @InjectRepository(MissingIndex)
    private readonly missingIndexRepository: Repository<MissingIndex>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<MissingIndex> | null,
    filteringParams: FilteringParam<MissingIndex> | null,
  ): Promise<{ data: MissingIndexResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions and sorting order
      const where = getWhereConditions<MissingIndex>(filteringParams);
      const order = getSortingOrder<MissingIndex>(sortingParams);

      // Retrieve data with pagination, sorting, and filtering from the repository
      const [data, totalItems] = await this.missingIndexRepository.findAndCount({
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
        data: plainToInstance(MissingIndexResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Handle any database errors
      throw error;
    }
  }

  async findOne(id: number): Promise<MissingIndexResponseDto> {
    try {
      const missingIndex = await this.missingIndexRepository.findOne({
        where: { id },
        select: [
          'id',
          'databaseName',
          'schemaName',
          'tableName',
          'sqlText',
          'statementId',
          'usecounts',
          'refcounts',
          'impact',
          'equalityColumns',
          'inequalityColumns',
          'includeColumns',
          'queryPlan',
          'planHandle',
          'serverName',
          'databaseNam',
          'ingestedTimestamp',
        ],
      });

      if (!missingIndex) {
        this.logger.warn(`MissingIndex with ID ${id} not found`);
        throw new NotFoundException(`MissingIndex with ID ${id} not found`);
      }

      return plainToInstance(MissingIndexResponseDto, missingIndex, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
