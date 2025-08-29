import { Test, TestingModule } from '@nestjs/testing';
import { QueryExecutionService } from './query_execution.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryExecution } from '../common/entities/model/query-execution.entity';
import { QueryExecutionResponseDto } from './dto/query-execution.response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('QueryExecutionService', () => {
  let service: QueryExecutionService;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryExecutionService,
        {
          provide: getRepositoryToken(QueryExecution),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QueryExecutionService>(QueryExecutionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of QueryExecutionResponseDto with pagination metadata', async () => {
      const queryExecutions: Partial<QueryExecution>[] = [
        {
          id: 1,
          queryId: 123,
          queryHash: Buffer.from('abcd', 'hex'),
          databaseName: 'DatabaseName',
          logicalReads: 1000,
          logicalWrites: 500,
          cpuTime: 150,
          elapsedTime: 1200,
          lastExecutionTime: new Date('2024-10-29T12:34:56Z'),
          executionCount: 5,
          serverName: 'ServerName',
          transformedTimestamp: new Date('2024-10-31T12:34:56Z'),
        },
      ];
      const totalItems = 1;
      const paginationParams = { page: 1, limit: 10, offset: 0 };
      const expectedDtos = plainToInstance(QueryExecutionResponseDto, queryExecutions, {
        excludeExtraneousValues: true,
      });

      mockRepository.findAndCount.mockResolvedValue([queryExecutions, totalItems]);

      const result = await service.getList(paginationParams, null, null);

      const expectedMeta = {
        page: 1,
        take: 10,
        itemCount: totalItems,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };

      expect(result).toEqual({ data: expectedDtos, meta: expectedMeta });
      expect(mockRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single QueryExecutionResponseDto', async () => {
      const queryExecution: Partial<QueryExecution> = {
        id: 1,
        queryId: 123,
        queryHash: Buffer.from('abcd', 'hex'),
        databaseName: 'DatabaseName',
        logicalReads: 1000,
        logicalWrites: 500,
        cpuTime: 150,
        elapsedTime: 1200,
        lastExecutionTime: new Date('2024-10-29T12:34:56Z'),
        executionCount: 5,
        serverName: 'ServerName',
        transformedTimestamp: new Date('2024-10-31T12:34:56Z'),
      };
      const expectedDto = plainToInstance(QueryExecutionResponseDto, queryExecution, {
        excludeExtraneousValues: true,
      });

      mockRepository.findOne.mockResolvedValue(queryExecution);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if query execution not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
