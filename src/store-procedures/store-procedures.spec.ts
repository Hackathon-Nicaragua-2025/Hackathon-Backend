import { Test, TestingModule } from '@nestjs/testing';
import { StoreProceduresService } from './store-procedures.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoreProcedures } from '../common/entities/raw/store-procedures.entity';
import { StoreProceduresResponseDto } from './dto/store-procedures-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('StoreProceduresService', () => {
  let service: StoreProceduresService;
  let repository: Repository<StoreProcedures>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreProceduresService,
        {
          provide: getRepositoryToken(StoreProcedures),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StoreProceduresService>(StoreProceduresService);
    repository = module.get<Repository<StoreProcedures>>(getRepositoryToken(StoreProcedures));
  });

  describe('getList', () => {
    it('should return a paginated list of store procedures in DTO format', async () => {
      const storeProcedures = [
        {
          id: 1,
          procedureName: 'uspGetUserDetails',
          procedureDefinition: 'CREATE PROCEDURE uspGetUserDetails AS BEGIN ... END',
          serverName: 'Server01',
          databaseNam: 'TestDB',
          ingestedTimestamp: new Date(),
        },
      ];

      const totalItems = storeProcedures.length;

      // Mock repository response for findAndCount
      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([
        plainToInstance(StoreProcedures, storeProcedures), // Simulate entity format
        totalItems,
      ]);

      const result = await service.getList({ page: 1, limit: 10 }, null, null);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(StoreProceduresResponseDto, storeProcedures, {
        excludeExtraneousValues: true,
      });
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
    it('should return a single store procedure in DTO format by ID', async () => {
      const storeProcedure = {
        id: 1,
        procedureName: 'uspGetUserDetails',
        procedureDefinition: 'CREATE PROCEDURE uspGetUserDetails AS BEGIN ... END',
        serverName: 'Server01',
        databaseNam: 'TestDB',
        ingestedTimestamp: new Date(),
      };

      // Mock repository response for findOne
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(plainToInstance(StoreProcedures, storeProcedure) as StoreProcedures);

      const result = await service.findOne(1);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(StoreProceduresResponseDto, storeProcedure, {
        excludeExtraneousValues: true,
      });
      expect(result).toEqual(expectedData);
    });

    it('should throw NotFoundException if the store procedure is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.findOne(1)).rejects.toThrow('An error occurred while processing your request');
    });
  });
});
