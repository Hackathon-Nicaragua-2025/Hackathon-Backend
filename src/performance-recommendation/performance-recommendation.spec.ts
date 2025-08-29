import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceRecommendationService } from './performance-recommendation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PerformanceRecommendation } from '../common/entities/aggmodel/performance-recommendation.entity';
import { PerformanceRecommendationResponseDto } from './dto/performance-recommendation-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('PerformanceRecommendationService', () => {
  let service: PerformanceRecommendationService;
  let repository: Repository<PerformanceRecommendation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerformanceRecommendationService,
        {
          provide: getRepositoryToken(PerformanceRecommendation),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PerformanceRecommendationService>(PerformanceRecommendationService);
    repository = module.get<Repository<PerformanceRecommendation>>(getRepositoryToken(PerformanceRecommendation));
  });

  describe('getList', () => {
    it('should return a paginated list of performance recommendations in DTO format', async () => {
      const recommendations = [
        {
          id: 1,
          aggId: 101,
          recommendationText: 'Optimize query execution plan',
          recommendationType: 'Performance',
          impactEstimation: 'High',
          status: 'Pending',
          implementationDate: new Date('2023-10-01'),
        },
        {
          id: 2,
          aggId: 102,
          recommendationText: 'Add indexes to frequently queried columns',
          recommendationType: 'Performance',
          impactEstimation: 'Medium',
          status: 'In Progress',
          implementationDate: new Date('2023-09-15'),
        },
      ];
      const totalItems = recommendations.length;

      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([recommendations, totalItems]);

      const result = await service.getList({ page: 1, limit: 10 }, null, null);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(PerformanceRecommendationResponseDto, recommendations, {
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
    it('should return a single performance recommendation in DTO format by ID', async () => {
      const recommendation = {
        id: 1,
        aggId: 101,
        recommendationText: 'Optimize query execution plan',
        recommendationType: 'Performance',
        impactEstimation: 'High',
        status: 'Pending',
        implementationDate: new Date('2023-10-01'),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(recommendation as PerformanceRecommendation);

      const result = await service.findOne(1);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(PerformanceRecommendationResponseDto, recommendation, {
        excludeExtraneousValues: true,
      });
      expect(result).toEqual(expectedData);
    });

    it('should throw NotFoundException if the performance recommendation is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.findOne(1)).rejects.toThrow('An error occurred while processing your request');
    });
  });
});
