import { Test, TestingModule } from '@nestjs/testing';
import { StatsPerTableService } from './stats-per-table.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatsPerTable } from '../common/entities/raw/stats-per-table.entity';
import { StatsPerTableResponseDto } from './dto/stats-per-table.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';

describe('StatsPerTableService', () => {
  let service: StatsPerTableService;

  const mockStatsPerTableRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsPerTableService,
        {
          provide: getRepositoryToken(StatsPerTable),
          useValue: mockStatsPerTableRepository,
        },
      ],
    }).compile();

    service = module.get<StatsPerTableService>(StatsPerTableService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of StatsPerTableResponseDto with pagination metadata', async () => {
      const statsPerTableEntities = [
        {
          id: 1,
          tableName: 'users',
          indexCount: 5,
          indexNames: 'IDX_User_Id, IDX_User_Name',
          numberOfRows: 1000,
          similarKeyStatus: 'active',
          serverName: 'Server123',
          databaseName: 'DatabaseXYZ',
          ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
        },
      ];
      const expectedDtos = plainToInstance(StatsPerTableResponseDto, statsPerTableEntities, {
        excludeExtraneousValues: true,
      });

      const totalItems = 1;
      mockStatsPerTableRepository.findAndCount.mockResolvedValue([statsPerTableEntities, totalItems]);

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
      expect(mockStatsPerTableRepository.findAndCount).toHaveBeenCalledWith({
        where: expect.any(Object),
        order: expect.any(Object),
        take: 10,
        skip: 0,
      });
      expect(mockStatsPerTableRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single StatsPerTableResponseDto', async () => {
      const statEntity = {
        id: 1,
        tableName: 'users',
        indexCount: 5,
        indexNames: 'IDX_User_Id, IDX_User_Name',
        numberOfRows: 1000,
        similarKeyStatus: 'active',
        serverName: 'Server123',
        databaseName: 'DatabaseXYZ',
        ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
      };
      const expectedDto = plainToInstance(StatsPerTableResponseDto, statEntity, {
        excludeExtraneousValues: true,
      });

      mockStatsPerTableRepository.findOne.mockResolvedValue(statEntity);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockStatsPerTableRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: [
          'id',
          'tableName',
          'indexCount',
          'indexNames',
          'numberOfRows',
          'similarKeyStatus',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
        ],
      });
      expect(mockStatsPerTableRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if stat not found', async () => {
      mockStatsPerTableRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockStatsPerTableRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        select: [
          'id',
          'tableName',
          'indexCount',
          'indexNames',
          'numberOfRows',
          'similarKeyStatus',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
        ],
      });
      expect(mockStatsPerTableRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
