import { Test, TestingModule } from '@nestjs/testing';
import { StatsPerIndexService } from './stats-per-index.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatsPerIndex } from '../common/entities/raw/stats-per-index.entity';
import { StatsPerIndexResponseDto } from './dto/stats-per-index.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';

describe('StatsPerIndexService', () => {
  let service: StatsPerIndexService;

  const mockStatsPerIndexRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsPerIndexService,
        {
          provide: getRepositoryToken(StatsPerIndex),
          useValue: mockStatsPerIndexRepository,
        },
      ],
    }).compile();

    service = module.get<StatsPerIndexService>(StatsPerIndexService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of StatsPerIndexResponseDto with pagination metadata', async () => {
      const statsPerIndexEntities = [
        {
          id: 1,
          schemaName: 'public',
          tableName: 'users',
          indexName: 'IX_User_Name',
          typeDesc: 'NONCLUSTERED',
          numberOfWrite: 10,
          numberOfSeeks: 50,
          numberOfScans: 5,
          serverName: 'Server123',
          databaseName: 'DatabaseXYZ',
          ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
        },
      ];
      const expectedDtos = plainToInstance(StatsPerIndexResponseDto, statsPerIndexEntities, {
        excludeExtraneousValues: true,
      });

      const totalItems = 1;
      mockStatsPerIndexRepository.findAndCount.mockResolvedValue([statsPerIndexEntities, totalItems]);

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
      expect(mockStatsPerIndexRepository.findAndCount).toHaveBeenCalledWith({
        where: expect.any(Object),
        order: expect.any(Object),
        take: 10,
        skip: 0,
      });
      expect(mockStatsPerIndexRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single StatsPerIndexResponseDto', async () => {
      const statEntity = {
        id: 1,
        schemaName: 'public',
        tableName: 'users',
        indexName: 'IX_User_Name',
        typeDesc: 'NONCLUSTERED',
        numberOfWrite: 10,
        numberOfSeeks: 50,
        numberOfScans: 5,
        serverName: 'Server123',
        databaseName: 'DatabaseXYZ',
        ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
      };
      const expectedDto = plainToInstance(StatsPerIndexResponseDto, statEntity, {
        excludeExtraneousValues: true,
      });

      mockStatsPerIndexRepository.findOne.mockResolvedValue(statEntity);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockStatsPerIndexRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: [
          'id',
          'schemaName',
          'tableName',
          'indexName',
          'typeDesc',
          'numberOfWrite',
          'numberOfSeeks',
          'numberOfScans',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
        ],
      });
      expect(mockStatsPerIndexRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if stat not found', async () => {
      mockStatsPerIndexRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockStatsPerIndexRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        select: [
          'id',
          'schemaName',
          'tableName',
          'indexName',
          'typeDesc',
          'numberOfWrite',
          'numberOfSeeks',
          'numberOfScans',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
        ],
      });
      expect(mockStatsPerIndexRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
