import { Test, TestingModule } from '@nestjs/testing';
import { TableReviewService } from './table_review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TableReview } from '../common/entities/model/table-review.entity';
import { TableReviewResponseDto } from './dto/table-review.response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('TableReviewService', () => {
  let service: TableReviewService;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableReviewService,
        {
          provide: getRepositoryToken(TableReview),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TableReviewService>(TableReviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return an array of TableReviewResponseDto with pagination metadata', async () => {
      const tableReviews = [
        {
          tableId: 1,
          week: new Date('2024-11-01'),
          tableName: 'users_table',
          rowCount: 500000,
          sizeMb: 150.75,
          reads: 1000000,
          scans: 500000,
          seeks: 200000,
          writes: 300000,
          updates: 150000,
          queryList: '[{"query":"SELECT * FROM users"}]',
          indexes: '[{"index":"IDX_UserID"}]',
          dependencies: '[{"dependency":"orders_table"}]',
          recommendations: '[{"recommendation":"Add index on user_id"}]',
          lastRunTime: new Date('2024-11-01T08:00:00Z'),
          nextRunTime: new Date('2024-11-08T08:00:00Z'),
        },
      ];
      const totalItems = 1;
      const paginationParams = { page: 1, limit: 10, offset: 0 };
      const expectedDtos = plainToInstance(TableReviewResponseDto, tableReviews, {
        excludeExtraneousValues: true,
      });

      mockRepository.findAndCount.mockResolvedValue([tableReviews, totalItems]);

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
    it('should return a single TableReviewResponseDto', async () => {
      const tableReview = {
        tableId: 1,
        week: new Date('2024-11-01'),
        tableName: 'users_table',
        rowCount: 500000,
        sizeMb: 150.75,
        reads: 1000000,
        scans: 500000,
        seeks: 200000,
        writes: 300000,
        updates: 150000,
        queryList: '[{"query":"SELECT * FROM users"}]',
        indexes: '[{"index":"IDX_UserID"}]',
        dependencies: '[{"dependency":"orders_table"}]',
        recommendations: '[{"recommendation":"Add index on user_id"}]',
        lastRunTime: new Date('2024-11-01T08:00:00Z'),
        nextRunTime: new Date('2024-11-08T08:00:00Z'),
      };
      const expectedDto = plainToInstance(TableReviewResponseDto, tableReview, {
        excludeExtraneousValues: true,
      });

      mockRepository.findOne.mockResolvedValue(tableReview);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { tableId: 1 },
        select: [
          'tableId',
          'week',
          'tableName',
          'rowCount',
          'sizeMb',
          'reads',
          'scans',
          'seeks',
          'writes',
          'updates',
          'queryList',
          'indexes',
          'dependencies',
          'recommendations',
          'lastRunTime',
          'nextRunTime',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if table review not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { tableId: 999 },
        select: [
          'tableId',
          'week',
          'tableName',
          'rowCount',
          'sizeMb',
          'reads',
          'scans',
          'seeks',
          'writes',
          'updates',
          'queryList',
          'indexes',
          'dependencies',
          'recommendations',
          'lastRunTime',
          'nextRunTime',
        ],
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
