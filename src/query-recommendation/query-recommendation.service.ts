import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRecommendationQueryDto } from './dto/create-query-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-query-recommendation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RecommendationQueryResponseDto } from './dto/query-recommendation-response.dto';
import { RecommendationQuery } from '../common/entities/model/query-recommendation.entity';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { Query } from '../common/entities/model/query.entity';

@Injectable()
export class QueryRecommendationService {
  private readonly logger = new Logger(QueryRecommendationService.name);

  constructor(
    @InjectRepository(RecommendationQuery)
    private readonly recommendationRepository: Repository<RecommendationQuery>,

    @InjectRepository(Query)
    private readonly queryRepository: Repository<Query>,
  ) {}

  async getList<T extends RecommendationQuery>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: RecommendationQueryResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.recommendationRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['query'],
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
        data: plainToInstance(RecommendationQueryResponseDto, data, {
          excludeExtraneousValues: false,
        }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async create(createRecommendationDto: CreateRecommendationQueryDto): Promise<RecommendationQueryResponseDto> {
    try {
      const recommendation = this.recommendationRepository.create(createRecommendationDto);

      const savedRecommendation = await this.recommendationRepository.save(recommendation);
      this.logger.log(`Successfully created recommendation with ID ${savedRecommendation.id}`);

      return plainToInstance(RecommendationQueryResponseDto, savedRecommendation, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<RecommendationQueryResponseDto> {
    try {
      const recommendation = await this.recommendationRepository.findOne({
        where: { id: id },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['query'],
      });

      if (!recommendation) {
        this.logger.warn(`Recommendation with ID ${id} not found`);
        throw new NotFoundException(`Recommendation with ID ${id} not found`);
      }

      return plainToInstance(RecommendationQueryResponseDto, recommendation, {
        excludeExtraneousValues: false,
      });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateRecommendationDto): Promise<RecommendationQueryResponseDto> {
    // Find the recommendation directly and throw NotFoundException if not found
    const recommendation = await this.recommendationRepository.findOne({
      where: { id: id },
      select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
      relations: ['query'],
    });

    if (!recommendation) {
      this.logger.warn(`Recommendation with ID ${id} not found`);
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }

    if (updateDto.queryId) {
      this.logger.log(`Checking query with ID ${updateDto.queryId}`);
      const query = await this.queryRepository.findOneBy({ id: updateDto.queryId });
      if (!query) {
        this.logger.warn(`Query with ID ${updateDto.queryId} not found`);
        throw new NotFoundException(`Query with ID ${updateDto.queryId} not found`);
      }
      recommendation.query = query;
    }

    Object.assign(recommendation, updateDto);

    try {
      const savedRecommendation = await this.recommendationRepository.save(recommendation);
      this.logger.log(`Recommendation with ID ${id} updated successfully`);

      return plainToInstance(RecommendationQueryResponseDto, savedRecommendation, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    // Find the recommendation directly and throw NotFoundException if not found
    const recommendation = await this.recommendationRepository.findOne({
      where: { id: id },
      select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
      relations: ['query'],
    });

    if (!recommendation) {
      this.logger.warn(`Recommendation with ID ${id} not found`);
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }

    try {
      await this.recommendationRepository.delete(id);
      this.logger.log(`Recommendation with ID ${id} deleted successfully`);
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async unlinkRecommendation(id: number): Promise<void> {
    // Find the recommendation directly and throw NotFoundException if not found
    const recommendation = await this.recommendationRepository.findOne({
      where: { id: id },
      relations: ['query'],
    });

    if (!recommendation) {
      this.logger.warn(`Recommendation with ID ${id} not found`);
      throw new NotFoundException('Recommendation not found');
    }

    if (!recommendation.query) {
      this.logger.warn(`Recommendation with ID ${id} is not linked to a query`);
      throw new BadRequestException('Recommendation is not linked to a query');
    }

    recommendation.query = undefined;

    try {
      await this.recommendationRepository.save(recommendation);
      this.logger.log(`Successfully unlinked recommendation with ID ${id}`);
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }
}
