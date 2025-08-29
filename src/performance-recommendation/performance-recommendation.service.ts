import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformanceRecommendation } from '../common/entities/aggmodel/performance-recommendation.entity';
import { PerformanceRecommendationResponseDto } from './dto/performance-recommendation-response.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PerformanceRecommendationService {
  private readonly logger = new Logger(PerformanceRecommendationService.name);

  constructor(
    @InjectRepository(PerformanceRecommendation)
    private readonly performanceRecommendationRepository: Repository<PerformanceRecommendation>,
  ) {}

  async getList(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<PerformanceRecommendation> | null,
    filteringParams: FilteringParam<PerformanceRecommendation> | null,
  ): Promise<{ data: PerformanceRecommendationResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      // Generate filtering conditions and sorting order
      const where = getWhereConditions<PerformanceRecommendation>(filteringParams);
      const order = getSortingOrder<PerformanceRecommendation>(sortingParams);

      // Retrieve data with pagination, sorting, and filtering from the repository
      const [data, totalItems] = await this.performanceRecommendationRepository.findAndCount({
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
        data: plainToInstance(PerformanceRecommendationResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error); // Handle any database errors
      throw error;
    }
  }

  async findOne(id: number): Promise<PerformanceRecommendationResponseDto> {
    try {
      const performanceRecommendation = await this.performanceRecommendationRepository.findOne({
        where: { id },
        select: [
          'id',
          'aggId',
          'recommendationText',
          'recommendationType',
          'impactEstimation',
          'status',
          'implementationDate',
        ],
      });

      if (!performanceRecommendation) {
        this.logger.warn(`PerformanceRecommendation with ID ${id} not found`);
        throw new NotFoundException(`PerformanceRecommendation with ID ${id} not found`);
      }

      return plainToInstance(PerformanceRecommendationResponseDto, performanceRecommendation, {
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
