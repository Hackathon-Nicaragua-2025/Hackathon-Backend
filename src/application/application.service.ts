import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { plainToInstance } from 'class-transformer';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { Application } from '../common/entities/model/application.entity';
import { ApplicationStatsResponseDto } from './dto/application-stats-response.dto';

const SELECT_FIELDS: (keyof Application)[] = [
  'id',
  'applicationName',
  'isActive',
  'ingestedDate',
  'transformedTimestamp',
];

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findAll<T extends Application>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: ApplicationResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.applicationRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: SELECT_FIELDS,
        relations: ['domain', 'queries'],
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
        data: plainToInstance(ApplicationResponseDto, data, {
          excludeExtraneousValues: true,
        }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ApplicationResponseDto> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      select: SELECT_FIELDS,
      relations: ['domain', 'queries'],
    });

    if (!application) {
      this.logger.warn(`Application with ID ${id} not found`);
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return plainToInstance(ApplicationResponseDto, application, {
      excludeExtraneousValues: true,
    });
  }

  async create(createApplicationDto: CreateApplicationDto): Promise<ApplicationResponseDto> {
    try {
      const application = this.applicationRepository.create({
        ...createApplicationDto,
        queries: [],
      });

      const savedApplication = await this.applicationRepository.save(application);

      this.logger.log(`Successfully created record with ID ${savedApplication.id}`);

      return plainToInstance(ApplicationResponseDto, savedApplication, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async update(id: number, updatedApplicationDto: UpdateApplicationDto): Promise<ApplicationResponseDto> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['domain', 'queries'],
    });

    if (!application) {
      this.logger.warn(`Application with ID ${id} not found`);
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    Object.assign(application, updatedApplicationDto);

    try {
      await this.applicationRepository.save(application);
      this.logger.log(`Application with ID ${id} updated successfully`);
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }

    return plainToInstance(ApplicationResponseDto, application, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      select: ['id'],
      relations: ['domain', 'queries'],
    });

    if (!application) {
      this.logger.warn(`Application with ID ${id} not found`);
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    try {
      await this.applicationRepository.delete(id);
      this.logger.log(`Application with ID ${id} deleted successfully`);
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async getApplicationStats(): Promise<ApplicationStatsResponseDto[]> {
    try {
      const data = await this.applicationRepository
        .createQueryBuilder('app')
        .select('app.application_id', 'id')
        .addSelect('app.application_name', 'applicationName')
        .addSelect('SUM(q.execution_count)', 'executionCount')
        .addSelect('SUM(q.avg_elapsed_time)', 'avgElapsedTime')
        .innerJoin('app.queries', 'q')
        .groupBy('app.application_id')
        .addGroupBy('app.application_name')
        .addOrderBy('applicationName', 'ASC')
        .getRawMany();

      return plainToInstance(ApplicationStatsResponseDto, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }
}
