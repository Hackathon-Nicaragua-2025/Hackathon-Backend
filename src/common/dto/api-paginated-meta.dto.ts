import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({
    example: 1,
    description: 'Número de página actual',
  })
  page!: number;

  @ApiProperty({
    example: 10,
    description: 'Número de elementos por página',
  })
  limit!: number;

  @ApiProperty({
    example: 100,
    description: 'Total de elementos',
  })
  total!: number;

  @ApiProperty({
    example: 10,
    description: 'Total de páginas',
  })
  totalPages!: number;

  @ApiProperty({
    example: true,
    description: 'Indica si hay página siguiente',
  })
  hasNextPage!: boolean;

  @ApiProperty({
    example: false,
    description: 'Indica si hay página anterior',
  })
  hasPreviousPage!: boolean;
}
