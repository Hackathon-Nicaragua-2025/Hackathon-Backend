import { Test, TestingModule } from '@nestjs/testing';
import { IndexWeeklyPerformanceMetricService } from './index_weekly_performance_metric.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IndexWeeklyPerformanceMetric } from '../common/entities/model/index-weekly-performance-metric.entity';
import { IndexWeeklyPerformanceMetricResponseDto } from './dto/index-weekly-performance-metric-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('IndexWeeklyPerformanceMetricService', () => {
  let service: IndexWeeklyPerformanceMetricService;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndexWeeklyPerformanceMetricService,
        {
          provide: getRepositoryToken(IndexWeeklyPerformanceMetric),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IndexWeeklyPerformanceMetricService>(IndexWeeklyPerformanceMetricService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of IndexWeeklyPerformanceMetricResponseDto with pagination metadata', async () => {
      const metrics: Partial<IndexWeeklyPerformanceMetric>[] = [
        {
          id: 1,
          weekEndDate: new Date('2024-10-28'),
          indexName: 'IX_User_Id',
          numberOfWrite: 123.45,
          numberOfSeeks: 234.56,
          numberOfScans: 345.67,
          transformedTimestamp: new Date('2024-10-28T12:34:56Z'),
        },
      ];
      const totalItems = 1;
      const paginationParams = { page: 1, limit: 10, offset: 0 };
      const expectedDtos = plainToInstance(IndexWeeklyPerformanceMetricResponseDto, metrics, {
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
    it('should return a single IndexWeeklyPerformanceMetricResponseDto', async () => {
      const metric: Partial<IndexWeeklyPerformanceMetric> = {
        id: 1,
        weekEndDate: new Date('2024-10-28'),
        indexName: 'IX_User_Id',
        numberOfWrite: 123.45,
        numberOfSeeks: 234.56,
        numberOfScans: 345.67,
        transformedTimestamp: new Date('2024-10-28T12:34:56Z'),
      };
      const expectedDto = plainToInstance(IndexWeeklyPerformanceMetricResponseDto, metric, {
        excludeExtraneousValues: true,
      });

      mockRepository.findOne.mockResolvedValue(metric);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: [
          'indexId',
          'weekEndDate',
          'indexName',
          'numberOfWrite',
          'numberOfSeeks',
          'numberOfScans',
          'transformedTimestamp',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if metric not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        select: [
          'indexId',
          'weekEndDate',
          'indexName',
          'numberOfWrite',
          'numberOfSeeks',
          'numberOfScans',
          'transformedTimestamp',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
