import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';
import { NotFoundException } from '@nestjs/common';
import { TableResponseDto } from './dto/table-response.dto';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { plainToInstance } from 'class-transformer';
import { Table } from '../common/entities/model/table.entity';

describe('TableService', () => {
  let service: TableService;

  const mockTables: Partial<Table>[] = [
    {
      id: 1,
      tableName: 'users',
      databaseName: 'db_prod',
      serverName: 'server01',
      rowCount: 1000,
      sizeMb: 100,
      totalReads: 2000,
      totalWrites: 400,
      totalUpdates: 200,
      totalScans: 50,
      transformedTimestamp: new Date('2021-08-01T00:00:00.000Z'),
    },
    {
      id: 2,
      tableName: 'orders',
      databaseName: 'db_prod',
      serverName: 'server01',
      rowCount: 2000,
      sizeMb: 150,
      totalReads: 3000,
      totalWrites: 600,
      totalUpdates: 400,
      totalScans: 75,
      transformedTimestamp: new Date('2021-08-02T00:00:00.000Z'),
    },
  ];

  const mockTableRepository = {
    create: jest.fn().mockImplementation((table) => ({ ...table, id: mockTables.length + 1 })),
    save: jest.fn().mockImplementation(async (table) => {
      mockTables.push({ ...table, id: mockTables.length + 1 });
      return { ...table, id: mockTables.length };
    }),
    findAndCount: jest.fn().mockResolvedValue([mockTables, mockTables.length]), // ajuste aquí
    findOne: jest.fn().mockImplementation(async (options) => {
      const { where } = options;
      const table = mockTables.find((t) => t.id === where.id);
      return table ? { ...table, indexes: [], recommendations: [] } : null;
    }),
    delete: jest.fn().mockImplementation(async (id) => {
      const index = mockTables.findIndex((table) => table.id === id);
      if (index >= 0) {
        mockTables.splice(index, 1);
        return { affected: 1 };
      }
      return { affected: 0 };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        {
          provide: 'TableRepository',
          useValue: mockTableRepository,
        },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
  });

  describe('create', () => {
    it('should create and return a new TableResponseDto', async () => {
      const createTableDto: CreateTableDto = {
        tableName: 'users',
        databaseName: 'db_prod',
        serverName: 'server01',
        rowCount: 1000,
        sizeMb: 100,
        totalReads: 2000,
        totalWrites: 400,
        totalUpdates: 200,
        totalScans: 50,
        schemaName: 'public',
      };

      const result = await service.create(createTableDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('ingestedTimestamp');
      expect(result).toEqual(
        expect.objectContaining({
          ...createTableDto,
          id: expect.any(Number),
          ingestedDate: undefined,
          ingestedTimestamp: undefined,
          recommendations: [],
          transformedTimestamp: undefined,
        }),
      );
      expect(mockTableRepository.create).toHaveBeenCalledTimes(1);
      expect(mockTableRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('getList', () => {
    it('should return an array of TableResponseDto', async () => {
      const result = await service.getList({ page: 1, limit: 10, offset: 0 }, null, null);
      const expectedResult = plainToInstance(TableResponseDto, mockTables, {
        excludeExtraneousValues: true,
      });

      expect(result.data).toEqual(expectedResult);
      expect(mockTableRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a TableResponseDto', async () => {
      const result = await service.findOne(1);
      const expectedResult = plainToInstance(
        TableResponseDto,
        {
          ...mockTables[0],
          recommendations: [],
        },
        {
          excludeExtraneousValues: true,
        },
      );

      expect(result).toEqual(expectedResult);
      expect(mockTableRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if table not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Table with ID 999 not found');
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update and return a TableResponseDto', async () => {
      const updateTableDto: UpdateTableDto = {
        tableName: 'users',
        databaseName: 'db_prod',
        serverName: 'server01',
        rowCount: 1000,
        sizeMb: 100,
        totalReads: 2000,
        totalWrites: 400,
        totalUpdates: 200,
        totalScans: 50,
        schemaName: 'public',
      };

      const result = await service.update(1, updateTableDto);

      expect(result).toEqual(expect.objectContaining(updateTableDto));
      expect(mockTableRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['indexes', 'recommendations'],
      });
      expect(mockTableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ id: 1, ...updateTableDto }));
    });

    it('should throw NotFoundException if table to update is not found', async () => {
      await expect(service.update(999, {} as UpdateTableDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(999, {} as UpdateTableDto)).rejects.toThrow('Table with ID 999 not found');
    });
  });

  describe('remove', () => {
    it('should delete the table and log success', async () => {
      await service.remove(1);
      expect(mockTableRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Array),
        relations: expect.any(Array),
      });
      expect(mockTableRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if table to delete is not found', async () => {
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('Table with ID 999 not found');
    });
  });
});
