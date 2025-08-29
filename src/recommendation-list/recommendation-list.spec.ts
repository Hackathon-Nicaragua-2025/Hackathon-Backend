import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationListService } from './recommendation-list.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecommendationList } from '../common/entities/config/recommendation-list.entity';
import { NotFoundException } from '@nestjs/common';
import { RecommendationListResponseDto } from './dto/recommendation-list-response.dto';
import { plainToInstance } from 'class-transformer';

describe('RecommendationListService', () => {
  let service: RecommendationListService;
  let repository: Repository<RecommendationList>;

  const mockRecommendations: Partial<RecommendationList>[] = [
    {
      id: 1,
      recommendationTitle: 'Optimize Database Indexing',
      recommendationDefinition: 'This recommendation involves optimizing database indexing for performance.',
      recommendationType: 'Performance',
    },
    {
      id: 2,
      recommendationTitle: 'Improve Security Protocols',
      recommendationDefinition: 'This recommendation involves improving security protocols.',
      recommendationType: 'Security',
    },
  ] as RecommendationList[];

  const mockRepository = {
    findAndCount: jest.fn().mockResolvedValue([mockRecommendations, mockRecommendations.length]),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationListService,
        {
          provide: getRepositoryToken(RecommendationList),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RecommendationListService>(RecommendationListService);
    repository = module.get<Repository<RecommendationList>>(getRepositoryToken(RecommendationList));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return a paginated list of recommendations', async () => {
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
        plainToInstance(RecommendationListResponseDto, mockRecommendations, { excludeExtraneousValues: true }),
      );
      expect(result.meta).toEqual({
        page: paginationParams.page,
        take: paginationParams.limit,
        itemCount: mockRecommendations.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single recommendation by ID', async () => {
      const recommendationId = 1;
      mockRepository.findOne.mockResolvedValue(mockRecommendations[0]);

      const result = await service.findOne(recommendationId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: recommendationId },
        select: ['id', 'recommendationTitle', 'recommendationDefinition', 'recommendationType'],
      });
      expect(result).toEqual(
        plainToInstance(RecommendationListResponseDto, mockRecommendations[0], { excludeExtraneousValues: true }),
      );
    });

    it('should throw NotFoundException if no recommendation is found', async () => {
      const recommendationId = 999;
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(recommendationId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: recommendationId },
        select: ['id', 'recommendationTitle', 'recommendationDefinition', 'recommendationType'],
      });
    });
  });
});
