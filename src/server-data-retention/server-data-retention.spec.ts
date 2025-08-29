import { Test, TestingModule } from '@nestjs/testing';
import { ServerDataRetentionService } from './server-data-retention.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerDataRetention } from '../common/entities/config/server-data-retention .entity';
import { ServerDataRetentionResponseDto } from './dto/server-data-retention-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('ServerDataRetentionService', () => {
  let service: ServerDataRetentionService;
  let repository: Repository<ServerDataRetention>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerDataRetentionService,
        {
          provide: getRepositoryToken(ServerDataRetention),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ServerDataRetentionService>(ServerDataRetentionService);
    repository = module.get<Repository<ServerDataRetention>>(getRepositoryToken(ServerDataRetention));
  });

  describe('getList', () => {
    it('should return a paginated list of server data retention records in DTO format', async () => {
      const serverData = [
        { id: 1, serverId: 101, serverName: 'PrimaryServer01', retentionDays: 30 },
        { id: 2, serverId: 102, serverName: 'BackupServer01', retentionDays: 15 },
      ];
      const totalItems = serverData.length;

      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([serverData, totalItems]);

      const result = await service.getList({ page: 1, limit: 10 }, null, null);

      // Check if data is transformed correctly to DTO format
      const expectedData = plainToInstance(ServerDataRetentionResponseDto, serverData, {
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
    it('should return a single server data retention record in DTO format by ID', async () => {
      const serverData = {
        id: 1,
        serverId: 101,
        serverName: 'PrimaryServer01',
        retentionDays: 30,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(serverData as ServerDataRetention);

      const result = await service.findOne(1);

      const expectedData = plainToInstance(ServerDataRetentionResponseDto, serverData, {
        excludeExtraneousValues: true,
      });
      expect(result).toEqual(expectedData);
    });

    it('should throw NotFoundException if the server data retention record is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.findOne(1)).rejects.toThrow('An error occurred while processing your request');
    });
  });
});
