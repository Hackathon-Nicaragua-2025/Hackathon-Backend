import { PartialType } from '@nestjs/swagger';
import { CreateRecommendationQueryDto } from './create-query-recommendation.dto';

export class UpdateRecommendationDto extends PartialType(CreateRecommendationQueryDto) {}
