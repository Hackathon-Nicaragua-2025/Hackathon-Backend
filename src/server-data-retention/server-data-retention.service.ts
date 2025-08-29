import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerDataRetention } from '../common/entities/config/server-data-retention .entity';
import { ServerDataRetentionResponseDto } from './dto/server-data-retention-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServerDataRetentionService {
  private readonly logger = new Logger(ServerDataRetentionService.name);

  constructor(
    @InjectRepository(ServerDataRetention)
    private readonly serverDataRetentionRepository: Repository<ServerDataRetention>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<ServerDataRetention> | null,
    filteringParams: FilteringParam<ServerDataRetention> | null,
  ): Promise<{ data: ServerDataRetentionResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions and sorting order
      const where = getWhereConditions<ServerDataRetention>(filteringParams);
      const order = getSortingOrder<ServerDataRetention>(sortingParams);

      // Retrieve data with pagination, sorting, and filtering from the repository
      const [data, totalItems] = await this.serverDataRetentionRepository.findAndCount({
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

      // Transform data to the response DTO
      return {
        data: plainToInstance(ServerDataRetentionResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Handle any database errors
      throw error;
    }
  }

  async findOne(id: number): Promise<ServerDataRetentionResponseDto> {
    try {
      const serverDataRetention = await this.serverDataRetentionRepository.findOne({
        where: { id },
        select: ['id', 'serverId', 'serverName', 'retentionDays'],
      });

      if (!serverDataRetention) {
        this.logger.warn(`ServerDataRetention with ID ${id} not found`);
        throw new NotFoundException(`ServerDataRetention with ID ${id} not found`);
      }

      return plainToInstance(ServerDataRetentionResponseDto, serverDataRetention, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
