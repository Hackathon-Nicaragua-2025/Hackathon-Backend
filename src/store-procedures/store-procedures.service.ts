import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreProcedures } from '../common/entities/raw/store-procedures.entity';
import { StoreProceduresResponseDto } from './dto/store-procedures-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StoreProceduresService {
  private readonly logger = new Logger(StoreProceduresService.name);

  constructor(
    @InjectRepository(StoreProcedures)
    private readonly storeProceduresRepository: Repository<StoreProcedures>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<StoreProcedures> | null,
    filteringParams: FilteringParam<StoreProcedures> | null,
  ): Promise<{ data: StoreProceduresResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions and sorting order
      const where = getWhereConditions<StoreProcedures>(filteringParams);
      const order = getSortingOrder<StoreProcedures>(sortingParams);

      // Retrieve data with pagination, sorting, and filtering from the repository
      const [data, totalItems] = await this.storeProceduresRepository.findAndCount({
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
        data: plainToInstance(StoreProceduresResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Handle any database errors
      throw error;
    }
  }

  async findOne(id: number): Promise<StoreProceduresResponseDto> {
    try {
      const storeProcedure = await this.storeProceduresRepository.findOne({
        where: { id },
        select: ['id', 'procedureName', 'procedureDefinition', 'serverName', 'databaseNam', 'ingestedTimestamp'],
      });

      if (!storeProcedure) {
        this.logger.warn(`StoreProcedure with ID ${id} not found`);
        throw new NotFoundException(`StoreProcedure with ID ${id} not found`);
      }

      return plainToInstance(StoreProceduresResponseDto, storeProcedure, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
