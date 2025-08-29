import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainResponseDto } from './dto/domain-response.dto';
import { plainToInstance } from 'class-transformer';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { Domain } from '../common/entities/model/domain.entity';
import { DomainStatsResponseDto } from './dto/domain-stats-response.dto';

const SELECT_FIELDS: (keyof Domain)[] = ['id', 'domainName', 'isActive', 'ingestedDate', 'transformedTimestamp'];

@Injectable()
export class DomainService {
  private readonly logger = new Logger(DomainService.name);
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {}

  async findAll<T extends Domain>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: DomainResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.domainRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: SELECT_FIELDS,
        relations: ['applications'],
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
        data: plainToInstance(DomainResponseDto, data, {
          excludeExtraneousValues: true,
        }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<DomainResponseDto> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      select: SELECT_FIELDS,
      relations: ['applications'],
    });

    if (!domain) {
      this.logger.warn(`Domain with ID ${id} not found`);
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    return plainToInstance(DomainResponseDto, domain, {
      excludeExtraneousValues: true,
    });
  }

  async create(createDomainDto: CreateDomainDto): Promise<DomainResponseDto> {
    try {
      const domain = this.domainRepository.create({
        ...createDomainDto,
        applications: [],
      });

      const savedDomain = await this.domainRepository.save(domain);

      this.logger.log(`Successfully created table with ID ${savedDomain.id}`);

      return plainToInstance(DomainResponseDto, savedDomain, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async update(id: number, updatedDomainDto: UpdateDomainDto): Promise<DomainResponseDto> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      relations: ['applications'],
    });

    if (!domain) {
      this.logger.warn(`Domain with ID ${id} not found`);
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    Object.assign(domain, updatedDomainDto);

    try {
      await this.domainRepository.save(domain);
      this.logger.log(`Domain with ID ${id} updated successfully`);
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }

    return plainToInstance(DomainResponseDto, domain, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      select: ['id'],
      relations: ['applications'],
    });

    if (!domain) {
      this.logger.warn(`Domain with ID ${id} not found`);
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    try {
      await this.domainRepository.delete(id);
      this.logger.log(`Domain with ID ${id} deleted successfully`);
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async getDomainStats(): Promise<DomainStatsResponseDto[]> {
    try {
      const data = await this.domainRepository
        .createQueryBuilder('d')
        .select('d.domain_id', 'domain_id')
        .addSelect('d.domain_name', 'domainName')
        .addSelect('SUM(q.execution_count)', 'executionCount')
        .addSelect('SUM(q.avg_elapsed_time)', 'avgElapsedTime')
        .innerJoin('d.applications', 'a')
        .innerJoin('a.queries', 'q')
        .groupBy('d.domain_id')
        .addGroupBy('d.domain_name')
        .addOrderBy('domainName', 'ASC')
        .getRawMany();

      return plainToInstance(DomainStatsResponseDto, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }
}
