import { Test, TestingModule } from '@nestjs/testing';
import { ExecplanService } from './execplan.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExecPlan } from '../common/entities/raw/execplan.entity';
import { ExecPlanResponseDto } from './dto/execplan-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('ExecplanService', () => {
  let service: ExecplanService;
  let repository: Repository<ExecPlan>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecplanService,
        {
          provide: getRepositoryToken(ExecPlan),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ExecplanService>(ExecplanService);
    repository = module.get<Repository<ExecPlan>>(getRepositoryToken(ExecPlan));
  });

  describe('getList', () => {
    it('should return a paginated list of execution plans in DTO format', async () => {
      const execPlans = [
        {
          id: 1,
          sqlText: 'SELECT * FROM users',
          queryHash: Buffer.from('abc123', 'utf-8'),
          creationTime: new Date('2023-10-01T12:00:00Z'),
          nodeId: 1,
          physicalOp: 'Index Seek',
          logicalOp: 'Nested Loops',
          estimatedTotalSubtreeCost: 5.25,
          estimatedRows: 100,
          estimatedIO: 0.1,
          estimatedCPU: 0.05,
          parallel: true,
          estimateRebinds: 1,
          estimateRewinds: 0,
          serverName: 'server01',
          databaseName: 'TestDB',
          ingestedTimestamp: new Date('2023-10-01T12:00:00Z'),
        },
        {
          id: 2,
          sqlText: 'SELECT * FROM orders',
          queryHash: Buffer.from('def456', 'utf-8'),
          creationTime: new Date('2023-10-02T12:00:00Z'),
          nodeId: 2,
          physicalOp: 'Table Scan',
          logicalOp: 'Hash Match',
          estimatedTotalSubtreeCost: 10.5,
          estimatedRows: 500,
          estimatedIO: 0.5,
          estimatedCPU: 0.2,
          parallel: false,
          estimateRebinds: 2,
          estimateRewinds: 1,
          serverName: 'server02',
          databaseName: 'OrderDB',
          ingestedTimestamp: new Date('2023-10-02T12:00:00Z'),
        },
      ];
      const totalItems = execPlans.length;

      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([execPlans, totalItems]);

      const result = await service.getList({ page: 1, limit: 10 }, null, null);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(ExecPlanResponseDto, execPlans, { excludeExtraneousValues: true });
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
    it('should return a single execution plan in DTO format by ID', async () => {
      const execPlan = {
        id: 1,
        sqlText: 'SELECT * FROM users',
        queryHash: Buffer.from('abc123', 'utf-8'),
        creationTime: new Date('2023-10-01T12:00:00Z'),
        nodeId: 1,
        physicalOp: 'Index Seek',
        logicalOp: 'Nested Loops',
        estimatedTotalSubtreeCost: 5.25,
        estimatedRows: 100,
        estimatedIO: 0.1,
        estimatedCPU: 0.05,
        parallel: true,
        estimateRebinds: 1,
        estimateRewinds: 0,
        serverName: 'server01',
        databaseName: 'TestDB',
        ingestedTimestamp: new Date('2023-10-01T12:00:00Z'),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(execPlan as ExecPlan);

      const result = await service.findOne(1);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(ExecPlanResponseDto, execPlan, { excludeExtraneousValues: true });
      expect(result).toEqual(expectedData);
    });

    it('should throw NotFoundException if execution plan is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.findOne(1)).rejects.toThrow('An error occurred while processing your request');
    });
  });
});
