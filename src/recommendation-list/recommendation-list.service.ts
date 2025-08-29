import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationList } from '../common/entities/config/recommendation-list.entity';
import { RecommendationListResponseDto } from './dto/recommendation-list-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RecommendationListService {
  private readonly logger = new Logger(RecommendationListService.name);

  constructor(
    @InjectRepository(RecommendationList)
    private readonly recommendationListRepository: Repository<RecommendationList>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<RecommendationList> | null,
    filteringParams: FilteringParam<RecommendationList> | null,
  ): Promise<{ data: RecommendationListResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions
      const where = getWhereConditions<RecommendationList>(filteringParams);

      // Generate sorting order based on sorting parameters
      const order = getSortingOrder<RecommendationList>(sortingParams);

      // Retrieve data with pagination and sorting from the repository
      const [data, totalItems] = await this.recommendationListRepository.findAndCount({
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
        data: plainToInstance(RecommendationListResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Log or handle database-related errors
      throw error; // Re-throw the error after handling it
    }
  }

  async findOne(id: number): Promise<RecommendationListResponseDto> {
    try {
      const recommendation = await this.recommendationListRepository.findOne({
        where: { id },
        select: ['id', 'recommendationTitle', 'recommendationDefinition', 'recommendationType'],
      });

      if (!recommendation) {
        this.logger.warn(`RecommendationList with ID ${id} not found`);
        throw new NotFoundException(`RecommendationList with ID ${id} not found`);
      }

      return plainToInstance(RecommendationListResponseDto, recommendation, { excludeExtraneousValues: true });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }
}
