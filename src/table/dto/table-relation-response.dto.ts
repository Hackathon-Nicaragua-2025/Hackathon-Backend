import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TableResponseDto } from './table-response.dto';

export class TableRelationResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the table.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'FK_Address_StateProvince_StateProvinceID', description: 'Name of the FK.' })
  @Expose()
  foreignKeyName!: string;

  @ApiProperty({ example: 1, description: 'Parent table ID' })
  @Expose()
  parentTable?: TableResponseDto;

  @ApiProperty({ example: 2, description: 'Referenced table ID' })
  @Expose()
  referencedTable?: TableResponseDto;
}
