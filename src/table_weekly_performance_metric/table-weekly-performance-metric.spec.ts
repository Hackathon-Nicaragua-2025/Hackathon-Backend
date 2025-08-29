import { Test, TestingModule } from '@nestjs/testing';
import { TableWeeklyPerformanceMetricService } from './table_weekly_performance_metric.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TableWeeklyPerformanceMetric } from '../common/entities/model/table-weekly-performance-metric.entity';
import { TableWeeklyPerformanceMetricResponseDto } from './dto/table-weekly-performance-metric-reponse.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('TableWeeklyPerformanceMetricService', () => {
  let service: TableWeeklyPerformanceMetricService;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableWeeklyPerformanceMetricService,
        {
          provide: getRepositoryToken(TableWeeklyPerformanceMetric),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TableWeeklyPerformanceMetricService>(TableWeeklyPerformanceMetricService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of TableWeeklyPerformanceMetricResponseDto with pagination metadata', async () => {
      const metrics = [
        {
          tableId: 1,
          weekEndDate: new Date('2024-11-01'),
          tableName: 'users_table',
          databaseName: 'main_database',
          serverName: 'server01',
          rowCount: 100000,
          sizeMb: 1024,
          totalReads: 5000000,
          totalWrites: 3000000,
          totalUpdates: 1500000,
          totalScans: 250000,
          transformedTimestamp: new Date('2024-11-01T08:00:00Z'),
        },
      ];
      const totalItems = 1;
      const paginationParams = { page: 1, limit: 10, offset: 0 };
      const expectedDtos = plainToInstance(TableWeeklyPerformanceMetricResponseDto, metrics, {
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
    it('should return a single TableWeeklyPerformanceMetricResponseDto', async () => {
      const metric = {
        tableId: 1,
        weekEndDate: new Date('2024-11-01'),
        tableName: 'users_table',
        databaseName: 'main_database',
        serverName: 'server01',
        rowCount: 100000,
        sizeMb: 1024,
        totalReads: 5000000,
        totalWrites: 3000000,
        totalUpdates: 1500000,
        totalScans: 250000,
        transformedTimestamp: new Date('2024-11-01T08:00:00Z'),
      };
      const expectedDto = plainToInstance(TableWeeklyPerformanceMetricResponseDto, metric, {
        excludeExtraneousValues: true,
      });

      mockRepository.findOne.mockResolvedValue(metric);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { tableId: 1 },
        select: [
          'tableId',
          'weekEndDate',
          'tableName',
          'databaseName',
          'serverName',
          'rowCount',
          'sizeMb',
          'totalReads',
          'totalWrites',
          'totalUpdates',
          'totalScans',
          'transformedTimestamp',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if metric not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { tableId: 999 },
        select: [
          'tableId',
          'weekEndDate',
          'tableName',
          'databaseName',
          'serverName',
          'rowCount',
          'sizeMb',
          'totalReads',
          'totalWrites',
          'totalUpdates',
          'totalScans',
          'transformedTimestamp',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
