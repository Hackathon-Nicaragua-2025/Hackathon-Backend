import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryExecution } from '../common/entities/model/query-execution.entity';
import { QueryExecutionResponseDto } from './dto/query-execution.response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class QueryExecutionService {
  private readonly logger = new Logger(QueryExecutionService.name);

  constructor(
    @InjectRepository(QueryExecution)
    private readonly queryExecutionRepository: Repository<QueryExecution>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<QueryExecution> | null,
    filteringParams: FilteringParam<QueryExecution> | null,
  ): Promise<{ data: QueryExecutionResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Genera las condiciones de filtrado con el tipo QueryExecution
      const where = getWhereConditions<QueryExecution>(filteringParams);

      // Genera el ordenamiento con el tipo QueryExecution
      const order = getSortingOrder<QueryExecution>(sortingParams);

      // Consulta en la base de datos con paginación, ordenamiento y condiciones de filtrado
      const [data, totalItems] = await this.queryExecutionRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
      });

      // Calcula la metadata de paginación
      const pageCount = Math.ceil(totalItems / limit);
      const meta: PaginatedMetaDto = {
        page,
        take: limit,
        itemCount: totalItems,
        pageCount,
        hasPreviousPage: page > 1,
        hasNextPage: page < pageCount,
      };

      // Transforma los datos al DTO de respuesta
      return {
        data: plainToInstance(QueryExecutionResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Manejo de errores específico de la base de datos
      throw error; // Relanzar el error después del manejo
    }
  }

  async findOne(id: number): Promise<QueryExecutionResponseDto> {
    try {
      const queryExecution = await this.queryExecutionRepository.findOne({
        where: { id },
      });

      if (!queryExecution) {
        this.logger.warn(`QueryExecution with ID ${id} not found`);
        throw new NotFoundException(`QueryExecution with ID ${id} not found`);
      }

      return plainToInstance(QueryExecutionResponseDto, queryExecution, {
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
