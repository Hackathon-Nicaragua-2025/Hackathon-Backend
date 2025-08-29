import { Test, TestingModule } from '@nestjs/testing';
import { MissingIndexService } from './missing-index.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MissingIndex } from '../common/entities/raw/missing-index.entity';
import { MissingIndexResponseDto } from './dto/missing-index-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('MissingIndexService', () => {
  let service: MissingIndexService;
  let repository: Repository<MissingIndex>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissingIndexService,
        {
          provide: getRepositoryToken(MissingIndex),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MissingIndexService>(MissingIndexService);
    repository = module.get<Repository<MissingIndex>>(getRepositoryToken(MissingIndex));
  });

  describe('getList', () => {
    it('should return a paginated list of missing indexes in DTO format', async () => {
      const missingIndexes = [
        {
          id: 1,
          databaseName: 'TestDB',
          schemaName: 'dbo',
          tableName: 'Users',
          sqlText: 'SELECT * FROM Users WHERE id = ?',
          statementId: 1,
          usecounts: 10,
          refcounts: 5,
          impact: 45.5,
          equalityColumns: 'id',
          inequalityColumns: 'name',
          includeColumns: 'address',
          queryPlan: '<QueryPlan>...</QueryPlan>',
          planHandle: Buffer.from('ABCDEF123456', 'hex'),
          serverName: 'Server01',
          databaseNam: 'TestDB',
          ingestedTimestamp: new Date(),
        },
      ];

      const totalItems = missingIndexes.length;

      // Mock the repository to return data in DTO format
      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([
        plainToInstance(MissingIndex, missingIndexes), // Convert to MissingIndex entity format
        totalItems,
      ]);

      const result = await service.getList({ page: 1, limit: 10 }, null, null);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(MissingIndexResponseDto, missingIndexes, { excludeExtraneousValues: true });
      expect(result.data).toEqual(expectedData);
      expect(result.meta.itemCount).toBe(totalItems);
      expect(result.meta.page).toBe(1);
      expect(result.meta.take).toBe(10);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(repository, 'findAndCount').mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.getList({ page: 1, limit: 10 }, null, null)).rejects.toThrow(
        'An error occurred while processing your request',
      );
    });
  });

  describe('findOne', () => {
    it('should return a single missing index in DTO format by ID', async () => {
      const missingIndex = {
        id: 1,
        databaseName: 'TestDB',
        schemaName: 'dbo',
        tableName: 'Users',
        sqlText: 'SELECT * FROM Users WHERE id = ?',
        statementId: 1,
        usecounts: 10,
        refcounts: 5,
        impact: 45.5,
        equalityColumns: 'id',
        inequalityColumns: 'name',
        includeColumns: 'address',
        queryPlan: '<QueryPlan>...</QueryPlan>',
        planHandle: Buffer.from('ABCDEF123456', 'hex'),
        serverName: 'Server01',
        databaseNam: 'TestDB',
        ingestedTimestamp: new Date(),
      };

      // Mock the repository to return data in MissingIndex entity format
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(plainToInstance(MissingIndex, missingIndex) as MissingIndex);

      const result = await service.findOne(1);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(MissingIndexResponseDto, missingIndex, { excludeExtraneousValues: true });
      expect(result).toEqual(expectedData);
    });

    it('should throw NotFoundException if the missing index is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.findOne(1)).rejects.toThrow('An error occurred while processing your request');
    });
  });
});
