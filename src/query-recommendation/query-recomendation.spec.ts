import { Test, TestingModule } from '@nestjs/testing';
import { QueryRecommendationService } from './query-recommendation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecommendationQuery } from '../common/entities/model/query-recommendation.entity';
import { Query } from '../common/entities/model/query.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRecommendationQueryDto } from './dto/create-query-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-query-recommendation.dto';
import { plainToInstance } from 'class-transformer';
import { RecommendationQueryResponseDto } from './dto/query-recommendation-response.dto';

describe('QueryRecommendationService', () => {
  let service: QueryRecommendationService;

  const mockRecommendationRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockQueryRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryRecommendationService,
        {
          provide: getRepositoryToken(RecommendationQuery),
          useValue: mockRecommendationRepository,
        },
        {
          provide: getRepositoryToken(Query),
          useValue: mockQueryRepository,
        },
      ],
    }).compile();

    service = module.get<QueryRecommendationService>(QueryRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return paginated RecommendationQueryResponseDto array', async () => {
      const mockRecommendations = [
        {
          id: 1,
          summary: 'Test summary 1',
          detailedExplanation: 'Detailed explanation 1',
          implementationPlan: 'Plan 1',
          impact: 'High',
          status: 'Pending',
        },
        {
          id: 2,
          summary: 'Test summary 2',
          detailedExplanation: 'Detailed explanation 2',
          implementationPlan: 'Plan 2',
          impact: 'Medium',
          status: 'Completed',
        },
      ];
      const paginationParams = { page: 1, limit: 2, offset: 0 };
      const totalItems = mockRecommendations.length;
      mockRecommendationRepository.findAndCount.mockResolvedValue([mockRecommendations, totalItems]);

      const result = await service.getList(paginationParams, null, null);

      expect(result.data).toEqual(
        plainToInstance(RecommendationQueryResponseDto, mockRecommendations, { excludeExtraneousValues: true }),
      );
      expect(result.meta).toEqual({
        page: 1,
        take: 2,
        itemCount: totalItems,
        pageCount: Math.ceil(totalItems / paginationParams.limit),
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if recommendation is not found', async () => {
      mockRecommendationRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(new NotFoundException('Recommendation with ID 1 not found'));
    });

    it('should return a RecommendationQueryResponseDto if recommendation is found', async () => {
      const mockRecommendation = {
        id: 1,
        summary: 'Test summary',
        detailedExplanation: 'Detailed explanation',
        implementationPlan: 'Plan',
        impact: 'High',
        status: 'Pending',
      };
      mockRecommendationRepository.findOne.mockResolvedValue(mockRecommendation);

      const result = await service.findOne(1);
      expect(result).toEqual(
        plainToInstance(RecommendationQueryResponseDto, mockRecommendation, { excludeExtraneousValues: true }),
      );
    });
  });

  describe('create', () => {
    it('should create and return a RecommendationQueryResponseDto', async () => {
      const createDto = new CreateRecommendationQueryDto();
      createDto.summary = 'New recommendation';

      const mockRecommendation = { id: 1, ...createDto };
      mockRecommendationRepository.create.mockReturnValue(mockRecommendation);
      mockRecommendationRepository.save.mockResolvedValue(mockRecommendation);

      const result = await service.create(createDto);
      expect(result).toEqual(
        plainToInstance(RecommendationQueryResponseDto, mockRecommendation, { excludeExtraneousValues: true }),
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if recommendation is not found', async () => {
      mockRecommendationRepository.findOne.mockResolvedValue(null);
      const updateDto = new UpdateRecommendationDto();
      updateDto.summary = 'Updated summary';

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new NotFoundException('Recommendation with ID 1 not found'),
      );
    });

    it('should update and return a RecommendationQueryResponseDto if recommendation is found', async () => {
      const existingRecommendation = {
        id: 1,
        summary: 'Old summary',
        detailedExplanation: 'Old explanation',
        implementationPlan: 'Old plan',
        impact: 'Medium',
        status: 'Pending',
      };
      const updateDto = new UpdateRecommendationDto();
      updateDto.summary = 'Updated summary';

      mockRecommendationRepository.findOne.mockResolvedValue(existingRecommendation);
      mockRecommendationRepository.save.mockResolvedValue({ ...existingRecommendation, ...updateDto });

      const result = await service.update(1, updateDto);
      expect(result).toEqual(
        plainToInstance(
          RecommendationQueryResponseDto,
          { ...existingRecommendation, ...updateDto },
          {
            excludeExtraneousValues: true,
          },
        ),
      );
    });

    it('should throw NotFoundException if query is not found when updating', async () => {
      const existingRecommendation = { id: 1, summary: 'Existing recommendation' };
      const updateDto = new UpdateRecommendationDto();
      updateDto.queryId = 999;

      mockRecommendationRepository.findOne.mockResolvedValue(existingRecommendation);
      mockQueryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(new NotFoundException('Query with ID 999 not found'));
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if recommendation is not found', async () => {
      mockRecommendationRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(new NotFoundException('Recommendation with ID 1 not found'));
    });

    it('should delete the recommendation if it exists', async () => {
      const mockRecommendation = { id: 1 };
      mockRecommendationRepository.findOne.mockResolvedValue(mockRecommendation);
      mockRecommendationRepository.delete.mockResolvedValue({});

      await service.delete(1);
      expect(mockRecommendationRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('unlinkRecommendation', () => {
    it('should throw NotFoundException if recommendation is not found', async () => {
      mockRecommendationRepository.findOne.mockResolvedValue(null);

      await expect(service.unlinkRecommendation(1)).rejects.toThrow(new NotFoundException('Recommendation not found'));
    });

    it('should throw BadRequestException if recommendation is not linked to a query', async () => {
      const mockRecommendation = { id: 1, query: null };
      mockRecommendationRepository.findOne.mockResolvedValue(mockRecommendation);

      await expect(service.unlinkRecommendation(1)).rejects.toThrow(
        new BadRequestException('Recommendation is not linked to a query'),
      );
    });

    it('should unlink the recommendation from the query if it is linked', async () => {
      // Mock recommendation data with additional properties
      const mockRecommendation = {
        id: 1,
        query: { id: 100 },
        summary: 'Old recommendation',
        detailedExplanation: 'Old explanation',
        impact: 'Medium',
        implementationPlan: 'Old plan',
        status: 'Pending',
      };

      // Expected unlinked recommendation
      const unlinkedRecommendation = { ...mockRecommendation, query: null };

      // Mock repository methods
      mockRecommendationRepository.findOne.mockResolvedValue(mockRecommendation);
      mockRecommendationRepository.save.mockResolvedValue(unlinkedRecommendation);

      // Run the unlink function
      await service.unlinkRecommendation(1);

      // Check if save was called with an object containing { id: 1, query: null } at least once
      expect(mockRecommendationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          query: undefined,
        }),
      );

      // Alternatively, to ensure only a specific call matches this structure, check the last call directly
      const lastCallArgs =
        mockRecommendationRepository.save.mock.calls[mockRecommendationRepository.save.mock.calls.length - 1][0];
      expect(lastCallArgs).toEqual(expect.objectContaining({ id: 1, query: undefined }));
    });
  });
});
