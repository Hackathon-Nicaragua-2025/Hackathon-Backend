import { Test, TestingModule } from '@nestjs/testing';
import { QueryService } from './query.service';
import { Query, Query as QueryEntity } from '../common/entities/model/query.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { plainToInstance } from 'class-transformer';
import { QueryResponseDto } from './dto/query-response.dto';

describe('QueryService', () => {
  let service: QueryService;

  const mockQueryRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockQueryEntity: Partial<Query> = {
    id: 1,
    serverName: 'MyServer',
    databaseName: 'MyDatabase',
    statementText: 'SELECT * FROM users WHERE id = 1',
    avgLogicalReads: 200,
    avgLogicalWrites: 100,
    avgWorkerTime: 300,
    avgElapsedTime: 5000,
    executionCount: 1,
    lastExecutionTime: new Date('2024-01-01T00:00:00Z'),
    ingestionTimestamp: new Date('2024-01-01T00:00:00Z'),
    transformedTimestamp: new Date('2024-01-02T00:00:00Z'),
    queryHash: Buffer.from([255, 197, 95, 108, 206, 94, 245, 131]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        {
          provide: getRepositoryToken(QueryEntity),
          useValue: mockQueryRepository,
        },
      ],
    }).compile();

    service = module.get<QueryService>(QueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return paginated data with QueryResponseDto array', async () => {
      const paginationParams = { page: 1, limit: 2, offset: 0 };
      const mockQueries = [mockQueryEntity];
      const totalItems = mockQueries.length;
      mockQueryRepository.findAndCount.mockResolvedValue([mockQueries, totalItems]);

      const result = await service.getList(paginationParams, null, null);

      expect(result.data).toEqual(plainToInstance(QueryResponseDto, mockQueries, { excludeExtraneousValues: true }));
      expect(result.meta).toEqual({
        page: 1,
        take: 2,
        itemCount: totalItems,
        pageCount: Math.ceil(totalItems / paginationParams.limit),
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      mockQueryRepository.findAndCount.mockRejectedValue(new Error());

      await expect(service.getList({ page: 1, limit: 2, offset: 0 }, null, null)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return a query by id', async () => {
      mockQueryRepository.findOne.mockResolvedValue(mockQueryEntity);

      const result = await service.findOneById(1);
      expect(result).toEqual(plainToInstance(QueryResponseDto, mockQueryEntity, { excludeExtraneousValues: true }));
      expect(mockQueryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['recommendations', 'queryExecution'],
        select: [
          'id',
          'serverName',
          'databaseName',
          'statementText',
          'queryHash',
          'avgLogicalReads',
          'avgLogicalWrites',
          'avgWorkerTime',
          'avgElapsedTime',
          'executionCount',
          'lastExecutionTime',
          'ingestionTimestamp',
          'transformedTimestamp',
        ],
      });
    });

    it('should throw NotFoundException if query is not found', async () => {
      mockQueryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(new NotFoundException('Query with ID 1 not found'));
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      mockQueryRepository.findOne.mockRejectedValue(new Error());

      await expect(service.findOneById(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    it('should successfully create a new query', async () => {
      const createQueryDto: CreateQueryDto = {
        serverName: 'MyServer',
        databaseName: 'MyDatabase',
        statementText: 'SELECT * FROM users WHERE id = 1',
        avgLogicalReads: 200,
        avgLogicalWrites: 100,
        avgWorkerTime: 300,
        avgElapsedTime: 5000,
        executionCount: 1,
        lastExecutionTime: new Date('2024-01-01T00:00:00Z'),
        ingestionTimestamp: new Date('2024-01-01T00:00:00Z'),
        transformedTimestamp: new Date('2024-01-02T00:00:00Z'),
      };

      const savedQueryEntity = { ...mockQueryEntity, id: 2 };
      mockQueryRepository.create.mockReturnValue(savedQueryEntity);
      mockQueryRepository.save.mockResolvedValue(savedQueryEntity);

      const result = await service.create(createQueryDto);
      expect(result).toEqual(plainToInstance(QueryResponseDto, savedQueryEntity, { excludeExtraneousValues: true }));
      expect(mockQueryRepository.create).toHaveBeenCalledWith({
        ...createQueryDto,
        queryHash: Buffer.from([255, 197, 95, 108, 206, 94, 245, 131]),
      });
      expect(mockQueryRepository.save).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      mockQueryRepository.save.mockRejectedValue(new Error());

      await expect(service.create(mockQueryEntity as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update an existing query', async () => {
      mockQueryRepository.findOne.mockResolvedValue(mockQueryEntity);
      mockQueryRepository.save.mockResolvedValue(mockQueryEntity);

      const updateQueryDto: UpdateQueryDto = { executionCount: 2 };
      const result = await service.update(1, updateQueryDto);
      expect(result).toEqual(plainToInstance(QueryResponseDto, mockQueryEntity, { excludeExtraneousValues: true }));
      expect(mockQueryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if query is not found', async () => {
      mockQueryRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(new NotFoundException('Query with ID 1 not found'));
    });
  });

  describe('delete', () => {
    it('should delete a query by id', async () => {
      mockQueryRepository.findOne.mockResolvedValue(mockQueryEntity);
      mockQueryRepository.remove.mockResolvedValue(undefined);

      await service.delete(1);
      expect(mockQueryRepository.remove).toHaveBeenCalledWith(mockQueryEntity);
    });

    it('should throw NotFoundException if query is not found', async () => {
      mockQueryRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(new NotFoundException('Query with ID 1 not found'));
    });
  });
});
