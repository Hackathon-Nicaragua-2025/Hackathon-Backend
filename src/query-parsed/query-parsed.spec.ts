import { Test, TestingModule } from '@nestjs/testing';
import { QueryParsedService } from './query-parsed.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryParsed } from '../common/entities/model/query-parsed.entity';
import { QueryParsedResponseDto } from './dto/query-parsed-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('QueryParsedService', () => {
  let service: QueryParsedService;
  let repository: Repository<QueryParsed>;

  const mockQueryParsedData: Partial<QueryParsed>[] = [
    {
      id: 1,
      queryId: 101,
      elementType: 'Table',
      elementValue: 'users',
      transformedTimestamp: new Date('2023-10-28T12:34:56Z'),
    },
    {
      id: 2,
      queryId: 102,
      elementType: 'Column',
      elementValue: 'username',
      transformedTimestamp: new Date('2023-11-01T10:34:56Z'),
    },
  ] as QueryParsed[];

  const mockRepository = {
    findAndCount: jest.fn().mockResolvedValue([mockQueryParsedData, mockQueryParsedData.length]),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryParsedService,
        {
          provide: getRepositoryToken(QueryParsed),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QueryParsedService>(QueryParsedService);
    repository = module.get<Repository<QueryParsed>>(getRepositoryToken(QueryParsed));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return a paginated list of parsed queries', async () => {
      const paginationParams = { page: 1, limit: 10 };
      const sortingParams = null;
      const filteringParams = null;

      const result = await service.getList(paginationParams, sortingParams, filteringParams);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: expect.anything(),
        order: expect.anything(),
        take: paginationParams.limit,
        skip: (paginationParams.page - 1) * paginationParams.limit,
      });
      expect(result.data).toEqual(
        plainToInstance(QueryParsedResponseDto, mockQueryParsedData, { excludeExtraneousValues: true }),
      );
      expect(result.meta).toEqual({
        page: paginationParams.page,
        take: paginationParams.limit,
        itemCount: mockQueryParsedData.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single parsed query record by ID', async () => {
      const queryParsedId = 1;
      mockRepository.findOne.mockResolvedValue(mockQueryParsedData[0]);

      const result = await service.findOne(queryParsedId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: queryParsedId },
        select: ['id', 'queryId', 'elementType', 'elementValue', 'transformedTimestamp'],
      });
      expect(result).toEqual(
        plainToInstance(QueryParsedResponseDto, mockQueryParsedData[0], { excludeExtraneousValues: true }),
      );
    });

    it('should throw NotFoundException if no parsed query record is found', async () => {
      const queryParsedId = 999;
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(queryParsedId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: queryParsedId },
        select: ['id', 'queryId', 'elementType', 'elementValue', 'transformedTimestamp'],
      });
    });
  });
});
