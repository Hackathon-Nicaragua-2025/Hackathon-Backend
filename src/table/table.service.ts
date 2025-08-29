import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from '../common/entities/model/table.entity';
import { Repository } from 'typeorm';
import { TableResponseDto } from './dto/table-response.dto';
import { plainToInstance } from 'class-transformer';
import { getSortingOrder, getWhereConditions, handleDBErrors } from '../common/helpers/typeorm-helpers';
import { PaginationParam, SortingParam, FilteringParam } from '../common/decorators';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';
import { TableRelation } from '../common/entities/model/table-relation.entity';
import { TableRelationResponseDto } from './dto/table-relation-response.dto';

const TABLE_SELECT_FIELDS: (keyof Table)[] = [
  'id',
  'tableName',
  'databaseName',
  'serverName',
  'rowCount',
  'sizeMb',
  'totalWrites',
  'totalUpdates',
  'totalReads',
  'totalScans',
  'transformedTimestamp',
  'database',
];

@Injectable()
export class TableService {
  private readonly logger = new Logger(TableService.name);
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(TableRelation)
    private readonly tableRelationRepository: Repository<TableRelation>,
  ) {}

  async getList<T extends Table>(
    { page, limit }: PaginationParam,
    sortingParams: SortingParam<T> | null,
    filteringParams: FilteringParam<T> | null,
  ): Promise<{ data: TableResponseDto[]; meta: PaginatedMetaDto }> {
    try {
      const where = getWhereConditions(filteringParams); // Apply filtering conditions based on T
      const order = getSortingOrder(sortingParams); // Apply sorting order based on T

      // Fetch data with pagination, sorting, and filtering
      const [data, totalItems] = await this.tableRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        select: TABLE_SELECT_FIELDS,
        relations: ['recommendations', 'database'],
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
        data: plainToInstance(TableResponseDto, data, {
          excludeExtraneousValues: false,
        }),
        meta,
      };
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<TableResponseDto> {
    const table = await this.tableRepository.findOne({
      where: { id },
      select: TABLE_SELECT_FIELDS,
      relations: ['recommendations', 'database'],
    });

    if (!table) {
      this.logger.warn(`Table with ID ${id} not found`);
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return plainToInstance(TableResponseDto, table, {
      excludeExtraneousValues: true,
    });
  }

  async create(createTableDto: CreateTableDto): Promise<TableResponseDto> {
    try {
      const table = this.tableRepository.create({
        ...createTableDto,
        recommendations: [],
      });

      const savedTable = await this.tableRepository.save(table);

      this.logger.log(`Successfully created table with ID ${savedTable.id}`);

      return plainToInstance(TableResponseDto, savedTable, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      handleDBErrors(error);
      throw error;
    }
  }

  async update(id: number, updateTableDto: UpdateTableDto): Promise<TableResponseDto> {
    const table = await this.tableRepository.findOne({
      where: { id },
      relations: ['indexes', 'recommendations'],
    });

    if (!table) {
      this.logger.warn(`Table with ID ${id} not found`);
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    Object.assign(table, updateTableDto);

    try {
      await this.tableRepository.save(table);
      this.logger.log(`Table with ID ${id} updated successfully`);
    } catch (error) {
      handleDBErrors(error);
    }

    return plainToInstance(TableResponseDto, table, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const table = await this.tableRepository.findOne({
      where: { id },
      select: ['id'],
      relations: ['indexes', 'recommendations'],
    });

    if (!table) {
      this.logger.warn(`Table with ID ${id} not found`);
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    try {
      await this.tableRepository.delete(id);
      this.logger.log(`Table with ID ${id} deleted successfully`);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findTablesByQueryId(queryId: number): Promise<TableResponseDto[]> {
    try {
      const data = await this.tableRepository
        .createQueryBuilder('table')
        .innerJoin('table.queries', 'query') // Join the Many-to-Many relation with Query
        .where('query.id = :queryId', { queryId }) // Filter by the provided queryId
        .getMany(); // Retrieve the matching tables

      return plainToInstance(TableResponseDto, data, { excludeExtraneousValues: true });
    } catch (error) {
      console.log('error', error);
      handleDBErrors(error);
      throw error;
    }
  }

  async findTablesByDatabaseId(databaseId: number): Promise<TableResponseDto[]> {
    try {
      const data = await this.tableRepository.find({
        relations: {
          database: false,
          recommendations: false,
          queries: false,
          indexes: true,
          parentTableRelations: false,
          referencedTableRelations: false,
        },
        where: {
          database: {
            id: databaseId,
          },
        },
      });

      return plainToInstance(TableResponseDto, data, { excludeExtraneousValues: false });
    } catch (error) {
      console.log('error', error);
      handleDBErrors(error);
      throw error;
    }
  }

  async findTablesRelationsByDatabaseId(databaseId: number): Promise<TableRelationResponseDto[]> {
    try {
      const data = await this.tableRelationRepository.find({
        select: ['id', 'foreignKeyName', 'parentTable', 'referencedTable'],
        relations: ['parentTable', 'referencedTable'],
        where: {
          parentTable: { database: { id: databaseId } },
          referencedTable: { database: { id: databaseId } },
        },
      });

      // console.log('data', data);

      return plainToInstance(TableRelationResponseDto, data, { excludeExtraneousValues: false });
    } catch (error) {
      console.log('error', error);
      handleDBErrors(error);
      throw error;
    }
  }
}
