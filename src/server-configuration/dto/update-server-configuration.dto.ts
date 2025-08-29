import { PartialType } from '@nestjs/swagger';
import { CreateServerConfigurationDto } from './create-server-configuration.dto';

export class UpdateServerConfigurationDto extends PartialType(CreateServerConfigurationDto) {}
