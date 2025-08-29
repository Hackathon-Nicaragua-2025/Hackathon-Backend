import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExecPlan } from '../common/entities/raw/execplan.entity';
import { ExecPlanResponseDto } from './dto/execplan-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ExecplanService {
  private readonly logger = new Logger(ExecplanService.name);

  constructor(
    @InjectRepository(ExecPlan)
    private readonly execplanRepository: Repository<ExecPlan>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<ExecPlan> | null,
    filteringParams: FilteringParam<ExecPlan> | null,
  ): Promise<{ data: ExecPlanResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions and sorting order
      const where = getWhereConditions<ExecPlan>(filteringParams);
      const order = getSortingOrder<ExecPlan>(sortingParams);

      // Retrieve data with pagination, sorting, and filtering from the repository
      const [data, totalItems] = await this.execplanRepository.findAndCount({
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
        data: plainToInstance(ExecPlanResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Handle any database errors
      throw error;
    }
  }

  async findOne(id: number): Promise<ExecPlanResponseDto> {
    try {
      const execPlan = await this.execplanRepository.findOne({
        where: { id },
        select: [
          'id',
          'sqlText',
          'queryHash',
          'creationTime',
          'nodeId',
          'physicalOp',
          'logicalOp',
          'estimatedTotalSubtreeCost',
          'estimatedRows',
          'estimatedIO',
          'estimatedCPU',
          'parallel',
          'estimateRebinds',
          'estimateRewinds',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
        ],
      });

      if (!execPlan) {
        this.logger.warn(`ExecPlan with ID ${id} not found`);
        throw new NotFoundException(`ExecPlan with ID ${id} not found`);
      }

      return plainToInstance(ExecPlanResponseDto, execPlan, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
