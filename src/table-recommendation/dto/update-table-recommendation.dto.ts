import { PartialType } from '@nestjs/swagger';
import { CreateTableRecommendationDto } from './create-table-recommendation.dto';

export class UpdateTableRecommendationDto extends PartialType(CreateTableRecommendationDto) {}
