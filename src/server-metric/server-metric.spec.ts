import { Test, TestingModule } from '@nestjs/testing';
import { ServerMetricService } from './server-metric.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerMetrics } from '../common/entities/raw/server_metrics.entity';
import { ServerMetricsResponseDto } from './dto/server-metric.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';

describe('ServerMetricService', () => {
  let service: ServerMetricService;

  const mockServerMetricsRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerMetricService,
        {
          provide: getRepositoryToken(ServerMetrics),
          useValue: mockServerMetricsRepository,
        },
      ],
    }).compile();

    service = module.get<ServerMetricService>(ServerMetricService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of ServerMetricsResponseDto with pagination metadata', async () => {
      const serverMetricsEntities = [
        {
          id: 1,
          serverName: 'Server123',
          queryCount: 150,
          databaseCount: 3,
          activeSessions: 10,
          memoryUsagePercent: 75,
          totalDiskIo: 500,
          lastWaitType: 'I/O',
          lastWaitTimeMs: 20,
          lastCpuTimeMs: 35,
          ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
        },
      ];
      const expectedDtos = plainToInstance(ServerMetricsResponseDto, serverMetricsEntities, {
        excludeExtraneousValues: true,
      });

      const totalItems = 1;
      mockServerMetricsRepository.findAndCount.mockResolvedValue([serverMetricsEntities, totalItems]);

      const paginationParams = { page: 1, limit: 10 };
      const sortingParams = null;
      const filteringParams = null;

      const result = await service.getList(paginationParams, sortingParams, filteringParams);

      const expectedMeta: PaginatedMetaDto = {
        page: 1,
        take: 10,
        itemCount: totalItems,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };

      expect(result).toEqual({ data: expectedDtos, meta: expectedMeta });
      expect(mockServerMetricsRepository.findAndCount).toHaveBeenCalledWith({
        where: expect.any(Object),
        order: expect.any(Object),
        take: 10,
        skip: 0,
      });
      expect(mockServerMetricsRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single ServerMetricsResponseDto', async () => {
      const serverMetricEntity = {
        id: 1,
        serverName: 'Server123',
        queryCount: 150,
        databaseCount: 3,
        activeSessions: 10,
        memoryUsagePercent: 75,
        totalDiskIo: 500,
        lastWaitType: 'I/O',
        lastWaitTimeMs: 20,
        lastCpuTimeMs: 35,
        ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
      };
      const expectedDto = plainToInstance(ServerMetricsResponseDto, serverMetricEntity, {
        excludeExtraneousValues: true,
      });

      mockServerMetricsRepository.findOne.mockResolvedValue(serverMetricEntity);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockServerMetricsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: [
          'id',
          'serverName',
          'queryCount',
          'databaseCount',
          'activeSessions',
          'memoryUsagePercent',
          'totalDiskIo',
          'lastWaitType',
          'lastWaitTimeMs',
          'lastCpuTimeMs',
          'ingestedTimestamp',
        ],
      });
      expect(mockServerMetricsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if server metric not found', async () => {
      mockServerMetricsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockServerMetricsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        select: [
          'id',
          'serverName',
          'queryCount',
          'databaseCount',
          'activeSessions',
          'memoryUsagePercent',
          'totalDiskIo',
          'lastWaitType',
          'lastWaitTimeMs',
          'lastCpuTimeMs',
          'ingestedTimestamp',
        ],
      });
      expect(mockServerMetricsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
