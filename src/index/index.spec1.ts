import { Test, TestingModule } from '@nestjs/testing';
import { IndexService } from './index.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Index } from '../common/entities/model/index.entity';
import { IndexResponseDto } from './dto/index-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginatedMetaDto } from '../common/dto/api-paginated-meta.dto';

describe('IndexService', () => {
  let service: IndexService;

  const mockIndexRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndexService,
        {
          provide: getRepositoryToken(Index),
          useValue: mockIndexRepository,
        },
      ],
    }).compile();

    service = module.get<IndexService>(IndexService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of IndexResponseDto with pagination metadata', async () => {
      const indexEntities = [
        {
          id: 1,
          indexId: 101,
          objectId: 202,
          tableName: 'Users',
          indexName: 'IX_User_Name',
          indexType: 'NONCLUSTERED',
          columnName: 'name',
          isDescendingKey: true,
          isIncludedColumn: false,
          serverName: 'Server123',
          databaseName: 'DatabaseXYZ',
          ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
          transformedTimestamp: new Date('2024-11-01T08:00:00Z'),
        },
      ];

      const expectedDtos = plainToInstance(IndexResponseDto, indexEntities, {
        excludeExtraneousValues: false,
      });

      const totalItems = 1;
      mockIndexRepository.findAndCount.mockResolvedValue([indexEntities, totalItems]);

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
      expect(mockIndexRepository.findAndCount).toHaveBeenCalledWith({
        where: expect.any(Object),
        order: expect.any(Object),
        take: 10,
        skip: 0,
      });
      expect(mockIndexRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single IndexResponseDto', async () => {
      const indexEntity = {
        id: 1,
        indexId: 101,
        objectId: 202,
        tableName: 'Users',
        indexName: 'IX_User_Name',
        indexType: 'NONCLUSTERED',
        columnName: 'name',
        isDescendingKey: true,
        isIncludedColumn: false,
        serverName: 'Server123',
        databaseName: 'DatabaseXYZ',
        ingestedTimestamp: new Date('2024-10-28T12:34:56Z'),
        transformedTimestamp: new Date('2024-11-01T08:00:00Z'),
      };
      const expectedDto = plainToInstance(IndexResponseDto, indexEntity, {
        excludeExtraneousValues: true,
      });

      mockIndexRepository.findOne.mockResolvedValue(indexEntity);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockIndexRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: [
          'id',
          'indexId',
          'objectId',
          'tableName',
          'indexName',
          'indexType',
          'columnName',
          'isDescendingKey',
          'isIncludedColumn',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
          'transformedTimestamp',
        ],
      });
      expect(mockIndexRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if index not found', async () => {
      mockIndexRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockIndexRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        select: [
          'id',
          'indexId',
          'objectId',
          'tableName',
          'indexName',
          'indexType',
          'columnName',
          'isDescendingKey',
          'isIncludedColumn',
          'serverName',
          'databaseName',
          'ingestedTimestamp',
          'transformedTimestamp',
        ],
      });
      expect(mockIndexRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
