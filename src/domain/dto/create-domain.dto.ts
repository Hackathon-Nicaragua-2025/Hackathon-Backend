import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateDomainDto {
  @ApiProperty({
    example: 'domain',
    description: 'Name of the Domain. Must be a valid string.',
  })
  @IsNotEmpty({ message: 'Domain name is required' })
  @IsString({ message: 'Domain name must be a string' })
  @Expose()
  domainName!: string;
}
