import { Test, TestingModule } from '@nestjs/testing';
import { QueryWeeklyPerformanceMetricService } from './query_weekly_performance_metric.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryWeeklyPerformanceMetric } from '../common/entities/model/query-weekly-performance-metric.entity';
import { QueryWeeklyPerformanceMetricResponseDto } from './dto/query-weekly-performance-metric-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('QueryWeeklyPerformanceMetricService', () => {
  let service: QueryWeeklyPerformanceMetricService;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryWeeklyPerformanceMetricService,
        {
          provide: getRepositoryToken(QueryWeeklyPerformanceMetric),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QueryWeeklyPerformanceMetricService>(QueryWeeklyPerformanceMetricService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of QueryWeeklyPerformanceMetricResponseDto with pagination metadata', async () => {
      const metrics = [
        {
          queryId: 1,
          weekEndDate: new Date('2024-10-28'),
          queryHash: Buffer.from('abcd', 'hex'),
          executionCount: 100,
          cpuTime: 5000,
          elapsedTime: 10000,
          logicalReads: 3000,
          logicalWrites: 1500,
          transformedTimestamp: new Date('2024-10-31T12:34:56Z'),
        },
      ];
      const totalItems = 1;
      const paginationParams = { page: 1, limit: 10, offset: 0 };
      const expectedDtos = plainToInstance(QueryWeeklyPerformanceMetricResponseDto, metrics, {
        excludeExtraneousValues: true,
      });

      mockRepository.findAndCount.mockResolvedValue([metrics, totalItems]);

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
    it('should return a single QueryWeeklyPerformanceMetricResponseDto', async () => {
      const metric = {
        queryId: 1,
        weekEndDate: new Date('2024-10-28'),
        queryHash: Buffer.from('abcd', 'hex'),
        executionCount: 100,
        cpuTime: 5000,
        elapsedTime: 10000,
        logicalReads: 3000,
        logicalWrites: 1500,
        transformedTimestamp: new Date('2024-10-31T12:34:56Z'),
      };
      const expectedDto = plainToInstance(QueryWeeklyPerformanceMetricResponseDto, metric, {
        excludeExtraneousValues: true,
      });

      mockRepository.findOne.mockResolvedValue(metric);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { queryId: 1 },
        select: [
          'queryId',
          'weekEndDate',
          'queryHash',
          'executionCount',
          'cpuTime',
          'elapsedTime',
          'logicalReads',
          'logicalWrites',
          'transformedTimestamp',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if query weekly performance metric not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { queryId: 999 },
        select: [
          'queryId',
          'weekEndDate',
          'queryHash',
          'executionCount',
          'cpuTime',
          'elapsedTime',
          'logicalReads',
          'logicalWrites',
          'transformedTimestamp',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
