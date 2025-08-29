import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseInformationService } from './database-information.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseInformation } from '../common/entities/raw/database-information.entity';
import { NotFoundException } from '@nestjs/common';
import { DatabaseInformationResponseDto } from './dto/database-information-response.dto';
import { plainToInstance } from 'class-transformer';

describe('DatabaseInformationService', () => {
  let service: DatabaseInformationService;
  let repository: Repository<DatabaseInformation>;

  const mockDatabaseInformation: Partial<DatabaseInformation>[] = [
    {
      id: 1,
      serverName: 'Server1',
      databaseId: 101,
      name: 'MainDB',
      creationDate: new Date('2023-10-28'),
      compatibilityLevel: 120,
      stateDesc: 'ONLINE',
      recoveryModel: 'FULL',
      dataTotalSizeMb: 500,
      dataUsedSpaceMb: 300,
      logTotalSizeMb: 100,
      logUsedSpaceMb: 50,
      ingestedTimestamp: new Date('2023-10-28T12:34:56Z'),
    },
    {
      id: 2,
      serverName: 'Server2',
      databaseId: 102,
      name: 'BackupDB',
      creationDate: new Date('2023-11-01'),
      compatibilityLevel: 130,
      stateDesc: 'RESTORING',
      recoveryModel: 'SIMPLE',
      dataTotalSizeMb: 300,
      dataUsedSpaceMb: 150,
      logTotalSizeMb: 80,
      logUsedSpaceMb: 40,
      ingestedTimestamp: new Date('2023-11-01T10:34:56Z'),
    },
  ] as DatabaseInformation[];

  const mockRepository = {
    findAndCount: jest.fn().mockResolvedValue([mockDatabaseInformation, mockDatabaseInformation.length]),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseInformationService,
        {
          provide: getRepositoryToken(DatabaseInformation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatabaseInformationService>(DatabaseInformationService);
    repository = module.get<Repository<DatabaseInformation>>(getRepositoryToken(DatabaseInformation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return a paginated list of database information records', async () => {
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
        plainToInstance(DatabaseInformationResponseDto, mockDatabaseInformation, { excludeExtraneousValues: true }),
      );
      expect(result.meta).toEqual({
        page: paginationParams.page,
        take: paginationParams.limit,
        itemCount: mockDatabaseInformation.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single database information record by ID', async () => {
      const databaseInfoId = 1;
      mockRepository.findOne.mockResolvedValue(mockDatabaseInformation[0]);

      const result = await service.findOne(databaseInfoId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: databaseInfoId },
        select: [
          'id',
          'serverName',
          'databaseId',
          'name',
          'creationDate',
          'compatibilityLevel',
          'stateDesc',
          'recoveryModel',
          'dataTotalSizeMb',
          'dataUsedSpaceMb',
          'logTotalSizeMb',
          'logUsedSpaceMb',
          'ingestedTimestamp',
        ],
      });
      expect(result).toEqual(
        plainToInstance(DatabaseInformationResponseDto, mockDatabaseInformation[0], { excludeExtraneousValues: true }),
      );
    });

    it('should throw NotFoundException if no database information record is found', async () => {
      const databaseInfoId = 999;
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(databaseInfoId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: databaseInfoId },
        select: [
          'id',
          'serverName',
          'databaseId',
          'name',
          'creationDate',
          'compatibilityLevel',
          'stateDesc',
          'recoveryModel',
          'dataTotalSizeMb',
          'dataUsedSpaceMb',
          'logTotalSizeMb',
          'logUsedSpaceMb',
          'ingestedTimestamp',
        ],
      });
    });
  });
});
