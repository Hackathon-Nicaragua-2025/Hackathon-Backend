import { CreateTableRecommendationDto } from './dto/create-table-recommendation.dto';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { plainToInstance } from 'class-transformer';
import { RecommendationTable } from '../common/entities/model/recommendation-table.entity';
import { RecommendationTableResponseDto } from './dto/table-recommendation-response.dto';
import { Repository } from 'typeorm';
import { UpdateTableRecommendationDto } from './dto/update-table-recommendation.dto';

@Injectable()
export class TableRecommendationService {
  private readonly logger = new Logger(TableRecommendationService.name);

  constructor(
    @InjectRepository(RecommendationTable)
    private readonly recommendationTableRepository: Repository<RecommendationTable>,
  ) {}

  async getList<T extends RecommendationTable>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: RecommendationTableResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering based on T
      const order = getSortingOrder(sortingParams); // Apply sorting based on T

      const [data, totalItems] = await this.recommendationTableRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
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
        data: plainToInstance(RecommendationTableResponseDto, data, { excludeExtraneousValues: true }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async create(createTableRecommendationDto: CreateTableRecommendationDto): Promise<RecommendationTableResponseDto> {
    try {
      const recommendation = this.recommendationTableRepository.create({
        ...createTableRecommendationDto,
        createdAt: new Date(),
        lastModifiedAt: new Date(),
      });

      const savedRecommendation = await this.recommendationTableRepository.save(recommendation);

      this.logger.log(`Successfully created recommendation with ID ${savedRecommendation.id}`);

      return plainToInstance(RecommendationTableResponseDto, savedRecommendation, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<RecommendationTableResponseDto> {
    try {
      const recommendation = await this.recommendationTableRepository.findOne({
        where: { id: id },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
      });

      if (!recommendation) {
        this.logger.warn(`Recommendation with ID ${id} not found`);
        throw new NotFoundException(`Recommendation with ID ${id} not found`);
      }

      return plainToInstance(RecommendationTableResponseDto, recommendation, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        handleDBErrors(error);
      }
      throw error;
    }
  }

  async update(
    id: number,
    updateTableRecommendationDto: UpdateTableRecommendationDto,
  ): Promise<RecommendationTableResponseDto> {
    const recommendation = await this.recommendationTableRepository.findOne({
      where: { id: id },
      select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
      relations: ['table'],
    });

    if (!recommendation) {
      this.logger.warn(`Recommendation with ID ${id} not found`);
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }

    Object.assign(recommendation, updateTableRecommendationDto);
    recommendation.lastModifiedAt = new Date();

    try {
      await this.recommendationTableRepository.save(recommendation);
      this.logger.log(`Recommendation with ID ${id} updated successfully`);
    } catch (error) {
      handleDBErrors(error);
    }

    return plainToInstance(RecommendationTableResponseDto, recommendation, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const recommendation = await this.recommendationTableRepository.findOne({
      where: { id: id },
      select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
      relations: ['table'],
    });

    if (!recommendation) {
      this.logger.warn(`Recommendation with ID ${id} not found`);
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }

    try {
      await this.recommendationTableRepository.delete(id);
      this.logger.log(`Recommendation with ID ${id} deleted successfully`);
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
