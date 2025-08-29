import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConfigurationService } from './database-configuration.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseConfiguration } from '../common/entities/config/database-configuration.entity';
import { NotFoundException } from '@nestjs/common';
import { DatabaseConfigurationResponseDto } from './dto/database-configuration-response.dto';
import { plainToInstance } from 'class-transformer';

describe('DatabaseConfigurationService', () => {
  let service: DatabaseConfigurationService;
  let repository: Repository<DatabaseConfiguration>;

  const mockDatabaseConfigurations: DatabaseConfiguration[] = [
    {
      id: 1,
      serverName: 'Server1',
      databaseName: 'Database1',
      isEnabled: true,
      ingestedDate: new Date('2023-10-28'),
      server: undefined,
      tables: [],
    },
    {
      id: 2,
      serverName: 'Server2',
      databaseName: 'Database2',
      isEnabled: false,
      ingestedDate: new Date('2023-10-29'),
      server: undefined,
      tables: [],
    },
  ];

  const mockRepository = {
    findAndCount: jest.fn().mockResolvedValue([mockDatabaseConfigurations, mockDatabaseConfigurations.length]),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseConfigurationService,
        {
          provide: getRepositoryToken(DatabaseConfiguration),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatabaseConfigurationService>(DatabaseConfigurationService);
    repository = module.get<Repository<DatabaseConfiguration>>(getRepositoryToken(DatabaseConfiguration));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return a paginated list of database configurations', async () => {
      const paginationParams = { page: 1, limit: 10 };
      const sortingParams = null;
      const filteringParams = null;

      const SELECT_FIELDS: (keyof DatabaseConfiguration)[] = [
        'id',
        'serverName',
        'databaseName',
        'isEnabled',
        'ingestedDate',
        'server',
      ];

      const result = await service.getList(paginationParams, sortingParams, filteringParams);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: expect.anything(),
        order: expect.anything(),
        take: paginationParams.limit,
        skip: (paginationParams.page - 1) * paginationParams.limit,
        select: SELECT_FIELDS,
        relations: {
          server: true,
        },
      });
      expect(result.data).toEqual(
        plainToInstance(DatabaseConfigurationResponseDto, mockDatabaseConfigurations, {
          excludeExtraneousValues: false,
        }),
      );
      expect(result.meta).toEqual({
        page: paginationParams.page,
        take: paginationParams.limit,
        itemCount: mockDatabaseConfigurations.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single database configuration by ID', async () => {
      const configId = 1;
      mockRepository.findOne.mockResolvedValue(mockDatabaseConfigurations[0]);

      const result = await service.findOne(configId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: configId },
        select: ['id', 'serverName', 'databaseName', 'isEnabled', 'ingestedDate'],
      });
      expect(result).toEqual(
        plainToInstance(DatabaseConfigurationResponseDto, mockDatabaseConfigurations[0], {
          excludeExtraneousValues: true,
        }),
      );
    });

    it('should throw NotFoundException if no database configuration is found', async () => {
      const configId = 999;
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(configId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: configId },
        select: ['id', 'serverName', 'databaseName', 'isEnabled', 'ingestedDate'],
      });
    });
  });
});
