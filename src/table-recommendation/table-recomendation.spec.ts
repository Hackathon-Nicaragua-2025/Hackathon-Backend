import { Test, TestingModule } from '@nestjs/testing';
import { TableRecommendationService } from './table-recommendation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecommendationTable } from '../common/entities/model/recommendation-table.entity';
import { NotFoundException, Logger } from '@nestjs/common';
import { CreateTableRecommendationDto } from './dto/create-table-recommendation.dto';
import { UpdateTableRecommendationDto } from './dto/update-table-recommendation.dto';

describe('TableRecommendationService', () => {
  let service: TableRecommendationService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableRecommendationService,
        {
          provide: getRepositoryToken(RecommendationTable),
          useValue: mockRepository,
        },
        Logger,
      ],
    }).compile();

    service = module.get<TableRecommendationService>(TableRecommendationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should return paginated recommendations', async () => {
      const recommendations = [
        { id: 1, summary: 'Test 1', detailedExplanation: 'Details 1' },
        { id: 2, summary: 'Test 2', detailedExplanation: 'Details 2' },
      ];
      const paginationMeta = { page: 1, limit: 10, offset: 0 };
      mockRepository.findAndCount.mockResolvedValue([recommendations, 2]);

      const result = await service.getList(paginationMeta, null, null);

      expect(result.data).toEqual(expect.arrayContaining(recommendations));
      expect(result.meta.itemCount).toBe(2);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new recommendation', async () => {
      const createDto: CreateTableRecommendationDto = {
        summary: 'New summary',
        detailedExplanation: 'New details',
        implementationPlan: 'Plan',
        impact: 'Impact',
        tableId: 1,
        status: 'OPEN',
      };

      const mockSavedRecommendation = { id: 1, ...createDto };
      mockRepository.create.mockReturnValue(mockSavedRecommendation);
      mockRepository.save.mockResolvedValue(mockSavedRecommendation);

      const result = await service.create(createDto);

      expect(result).toEqual(expect.objectContaining({ id: 1, summary: 'New summary' }));
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(createDto));
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single recommendation if found', async () => {
      const recommendation = { id: 1, summary: 'Test 1', detailedExplanation: 'Details 1' };
      mockRepository.findOne.mockResolvedValue(recommendation);

      const result = await service.findOne(1);

      expect(result).toEqual(expect.objectContaining(recommendation));
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated recommendation', async () => {
      const existingRecommendation = { id: 1, summary: 'Test 1', detailedExplanation: 'Details 1' };
      const updateDto: UpdateTableRecommendationDto = {
        summary: 'Updated summary',
      };
      const updatedRecommendation = { ...existingRecommendation, ...updateDto };

      mockRepository.findOne.mockResolvedValue(existingRecommendation);
      mockRepository.save.mockResolvedValue(updatedRecommendation);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(expect.objectContaining({ summary: 'Updated summary' }));
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if recommendation does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const updateDto: UpdateTableRecommendationDto = { summary: 'Updated summary' };

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
      });
    });
  });

  describe('delete', () => {
    it('should delete a recommendation successfully', async () => {
      const recommendation = { id: 1, summary: 'Test 1' };
      mockRepository.findOne.mockResolvedValue(recommendation);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
      });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if recommendation does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'summary', 'detailedExplanation', 'implementationPlan', 'impact', 'status'],
        relations: ['table'],
      });
    });
  });
});
