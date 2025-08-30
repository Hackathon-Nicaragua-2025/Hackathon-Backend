import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';
import { PaginatedMetaDto } from './api-paginated-meta.dto';

export class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  @ApiProperty({
    description: 'Metadata about pagination',
  })
  meta: PaginatedMetaDto;

  private constructor(data: T[], succeeded: boolean, message: string, title: string, meta: PaginatedMetaDto) {
    super();
    this.data = data;
    this.success = succeeded;
    this.message = message;
    this.title = title;
    this.meta = meta;
  }

  // Method for success case with pagination
  static PaginatedSuccess<T>(data: T[], meta: PaginatedMetaDto, title = '', message = ''): PaginatedResponseDto<T> {
    return new PaginatedResponseDto<T>(data, true, message, title, meta);
  }
}
