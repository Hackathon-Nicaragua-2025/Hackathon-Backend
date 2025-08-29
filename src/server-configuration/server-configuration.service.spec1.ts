import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';

import { ServerConfiguration } from '../common/entities/config/server-configuration.entity';
import { ServerConfigurationResponseDto } from './dto/server-configuration-response.dto';
import { ServerConfigurationService } from './server-configuration.service';
import { UpdateServerConfigurationDto } from './dto/update-server-configuration.dto';
import { ConnectionService } from '../common/services/connection.service';
import { DatabaseConfigurationService } from '../database-configuration/database-configuration.service';

describe('ServerConfigurationService', () => {
  let service: ServerConfigurationService;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockConnectionService = {
    getListDatabaseByServerConfiguration: jest.fn(),
  };

  const mockDatabaseConfigService = {
    findByServerName: jest.fn(),
    create: jest.fn(),
    softDeletes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerConfigurationService,
        {
          provide: getRepositoryToken(ServerConfiguration),
          useValue: mockRepository,
        },
        {
          provide: ConnectionService,
          useValue: mockConnectionService,
        },
        {
          provide: DatabaseConfigurationService,
          useValue: mockDatabaseConfigService,
        },
      ],
    }).compile();

    service = module.get<ServerConfigurationService>(ServerConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return paginated ServerConfigurationResponseDto array', async () => {
      const mockConfigurations = [
        { id: 1, serverName: 'Server 1', ipAddress: '192.168.1.1', isEnabled: true },
        { id: 2, serverName: 'Server 2', ipAddress: '192.168.1.2', isEnabled: false },
      ];
      const paginationParams = { page: 1, limit: 2 };
      const totalItems = mockConfigurations.length;
      mockRepository.findAndCount.mockResolvedValue([mockConfigurations, totalItems]);

      const result = await service.getList(paginationParams, null, null);

      expect(result.data).toEqual(
        plainToInstance(ServerConfigurationResponseDto, mockConfigurations, { excludeExtraneousValues: true }),
      );
      expect(result.meta).toEqual({
        page: 1,
        take: 2,
        itemCount: totalItems,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if configuration is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Server configuration with ID 1 not found.'),
      );
    });

    it('should return a ServerConfigurationResponseDto if configuration is found', async () => {
      const mockConfig = { id: 1, serverName: 'Test Server', ipAddress: '192.168.1.1', isEnabled: true };
      mockRepository.findOne.mockResolvedValue(mockConfig);

      const result = await service.findOne(1);
      expect(result).toEqual(
        plainToInstance(ServerConfigurationResponseDto, mockConfig, { excludeExtraneousValues: true }),
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if configuration is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const updateDto = new UpdateServerConfigurationDto();
      updateDto.timeout = 60;

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new NotFoundException('Server configuration with ID 1 not found.'),
      );
    });

    it('should update and return a ServerConfigurationResponseDto if configuration is found', async () => {
      const existingConfig = { id: 1, serverName: 'Test Server', ipAddress: '192.168.1.1', timeout: 30 };
      const updateDto = new UpdateServerConfigurationDto();
      updateDto.timeout = 60;

      mockRepository.findOne.mockResolvedValue(existingConfig);
      mockRepository.save.mockResolvedValue({ ...existingConfig, ...updateDto });

      const result = await service.update(1, updateDto);
      expect(result).toEqual(
        plainToInstance(
          ServerConfigurationResponseDto,
          { ...existingConfig, ...updateDto },
          {
            excludeExtraneousValues: true,
          },
        ),
      );
    });
  });

  describe('softDelete', () => {
    it('should throw NotFoundException if configuration is not found or already deleted', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.softDelete(1)).rejects.toThrow(
        new NotFoundException('Server configuration with ID 1 not found or already deleted.'),
      );
    });

    it('should soft delete and return the updated ServerConfigurationResponseDto if configuration is found', async () => {
      const mockConfig = { id: 1, serverName: 'Test Server', ipAddress: '192.168.1.1', deletedAt: null };
      const deletedConfig = { ...mockConfig, deletedAt: new Date() };
      mockRepository.findOne.mockResolvedValue(mockConfig);
      mockRepository.save.mockResolvedValue(deletedConfig);

      const result = await service.softDelete(1);
      expect(result).toEqual(
        plainToInstance(ServerConfigurationResponseDto, deletedConfig, { excludeExtraneousValues: true }),
      );
    });
  });

  describe('restore', () => {
    it('should throw NotFoundException if configuration is not found or not deleted', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.restore(1)).rejects.toThrow(
        new NotFoundException('Server configuration with ID 1 not found or not deleted.'),
      );
    });

    it('should restore and return the updated ServerConfigurationResponseDto if configuration is found', async () => {
      const mockConfig = { id: 1, serverName: 'Test Server', ipAddress: '192.168.1.1', deletedAt: new Date() };
      const restoredConfig = { ...mockConfig, deletedAt: null };
      mockRepository.findOne.mockResolvedValue(mockConfig);
      mockRepository.update.mockResolvedValue(restoredConfig);

      const result = await service.restore(1);
      expect(result).toEqual(
        plainToInstance(ServerConfigurationResponseDto, restoredConfig, { excludeExtraneousValues: true }),
      );
    });
  });
});
