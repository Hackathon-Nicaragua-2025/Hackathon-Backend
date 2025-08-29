import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginatedMetaDto } from '../dto/api-paginated-meta.dto';
import { PaginatedResponseDto } from '../dto/api-paginated-response.dto';

export function ApiResponseWithPagination(dataDto: Type<unknown>, description: string, status = 200) {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, PaginatedResponseDto, PaginatedMetaDto, dataDto),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) }, // Base structure
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) }, // Paginated data-specific structure
              },
              meta: { $ref: getSchemaPath(PaginatedMetaDto) }, // Meta-specific structure for pagination
            },
          },
        ],
      },
    }),
  );
}
