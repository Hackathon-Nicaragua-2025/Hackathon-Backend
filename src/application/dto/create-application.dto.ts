import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Domain } from '../../common/entities/model/domain.entity';

export class CreateApplicationDto {
  @ApiProperty({
    example: 'application',
    description: 'Name of the Application. Must be a valid string.',
  })
  @IsNotEmpty({ message: 'Application name is required' })
  @IsString({ message: 'Application name must be a string' })
  @Expose()
  applicationName!: string;

  @ApiProperty({
    example: {},
    description: 'Domain of the Application. Must be a valid string.',
  })
  @IsNotEmpty({ message: 'Domain is required' })
  @IsObject({ message: 'Domain must be a valid object' })
  @Expose()
  domain!: Domain;
}
