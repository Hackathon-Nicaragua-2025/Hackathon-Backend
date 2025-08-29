import { Test, TestingModule } from '@nestjs/testing';
import { QueryReviewService } from './query-review.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryReview } from '../common/entities/model/query-review.entity';
import { QueryReviewResponseDto } from './dto/query-review-response.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('QueryReviewService', () => {
  let service: QueryReviewService;
  let repository: Repository<QueryReview>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryReviewService,
        {
          provide: getRepositoryToken(QueryReview),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<QueryReviewService>(QueryReviewService);
    repository = module.get<Repository<QueryReview>>(getRepositoryToken(QueryReview));
  });

  describe('getList', () => {
    it('should return a paginated list of query reviews in DTO format', async () => {
      const queryReviews = [
        { id: 1, queryId: 123, queryText: 'SELECT * FROM users', codeLocation: '/src/app/service' },
        { id: 2, queryId: 124, queryText: 'SELECT * FROM orders', codeLocation: '/src/app/orders' },
      ];
      const totalItems = queryReviews.length;

      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([queryReviews, totalItems]);

      const result = await service.getList({ page: 1, limit: 10 }, null, null);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(QueryReviewResponseDto, queryReviews, { excludeExtraneousValues: true });
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
    it('should return a single query review in DTO format by ID', async () => {
      const queryReview = {
        id: 1,
        queryId: 123,
        queryText: 'SELECT * FROM users',
        codeLocation: '/src/app/service',
        status: 'Completed',
        hashKey: 'abc123',
        performanceMetrics: 'High',
        highlightedText: 'SELECT * FROM users',
        recommendationId: 5,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(queryReview as QueryReview);

      const result = await service.findOne(1);

      // Convert to DTO for expected result comparison
      const expectedData = plainToInstance(QueryReviewResponseDto, queryReview, { excludeExtraneousValues: true });
      expect(result).toEqual(expectedData);
    });

    it('should throw NotFoundException if query review is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.findOne(1)).rejects.toThrow('An error occurred while processing your request');
    });
  });
});
