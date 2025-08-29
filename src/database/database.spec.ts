import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Database } from '../common/entities/model/database.entity';
import { NotFoundException } from '@nestjs/common';
import { DatabaseResponseDto } from './dto/database-response.dto';
import { plainToInstance } from 'class-transformer';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let repository: Repository<Database>;

  const mockDatabases: Partial<Database>[] = [
    {
      id: 1,
      serverName: 'Server1',
      name: 'Database1',
      creationDate: new Date('2023-10-28'),
      dbId: 101,
      databaseName: 'MainDB',
      compatibilityLevel: 150,
      stateDesc: 'ONLINE',
      dbCreationDate: new Date('2023-10-28'),
      dbCompatibilityLevel: 120,
      totalSizeMb: 500.75,
      usedSpaceMb: 300.5,
      dbState: 'ONLINE',
      dbRecoveryModel: 'FULL',
      dataTotalSizeMb: 400,
      dataUsedSpaceMb: 250,
      logTotalSizeMb: 100,
      logUsedSpaceMb: 50,
      ingestionTimestamp: new Date('2023-10-28T12:34:56Z'),
      transformedTimestamp: new Date('2023-10-28T12:34:56Z'),
    },
    {
      id: 2,
      serverName: 'Server2',
      name: 'Database2',
      creationDate: new Date('2023-11-01'),
      dbId: 102,
      databaseName: 'BackupDB',
      compatibilityLevel: 130,
      stateDesc: 'RESTORING',
      dbCreationDate: new Date('2023-11-01'),
      dbCompatibilityLevel: 110,
      totalSizeMb: 300.25,
      usedSpaceMb: 150.5,
      dbState: 'OFFLINE',
      dbRecoveryModel: 'SIMPLE',
      dataTotalSizeMb: 200,
      dataUsedSpaceMb: 100,
      logTotalSizeMb: 80,
      logUsedSpaceMb: 40,
      ingestionTimestamp: new Date('2023-11-01T10:34:56Z'),
      transformedTimestamp: new Date('2023-11-01T10:34:56Z'),
    },
  ] as Database[];

  const mockRepository = {
    findAndCount: jest.fn().mockResolvedValue([mockDatabases, mockDatabases.length]),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: getRepositoryToken(Database),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    repository = module.get<Repository<Database>>(getRepositoryToken(Database));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return a paginated list of databases', async () => {
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
        plainToInstance(DatabaseResponseDto, mockDatabases, { excludeExtraneousValues: true }),
      );
      expect(result.meta).toEqual({
        page: paginationParams.page,
        take: paginationParams.limit,
        itemCount: mockDatabases.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single database by ID', async () => {
      const databaseId = 1;
      mockRepository.findOne.mockResolvedValue(mockDatabases[0]);

      const result = await service.findOne(databaseId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: databaseId },
        select: [
          'id',
          'serverName',
          'name',
          'creationDate',
          'dbId',
          'databaseName',
          'compatibilityLevel',
          'stateDesc',
          'dbCreationDate',
          'dbCompatibilityLevel',
          'totalSizeMb',
          'usedSpaceMb',
          'dbState',
          'dbRecoveryModel',
          'dataTotalSizeMb',
          'dataUsedSpaceMb',
          'logTotalSizeMb',
          'logUsedSpaceMb',
          'ingestionTimestamp',
          'transformedTimestamp',
        ],
      });
      expect(result).toEqual(plainToInstance(DatabaseResponseDto, mockDatabases[0], { excludeExtraneousValues: true }));
    });

    it('should throw NotFoundException if no database is found', async () => {
      const databaseId = 999;
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(databaseId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: databaseId },
        select: [
          'id',
          'serverName',
          'name',
          'creationDate',
          'dbId',
          'databaseName',
          'compatibilityLevel',
          'stateDesc',
          'dbCreationDate',
          'dbCompatibilityLevel',
          'totalSizeMb',
          'usedSpaceMb',
          'dbState',
          'dbRecoveryModel',
          'dataTotalSizeMb',
          'dataUsedSpaceMb',
          'logTotalSizeMb',
          'logUsedSpaceMb',
          'ingestionTimestamp',
          'transformedTimestamp',
        ],
      });
    });
  });
});
