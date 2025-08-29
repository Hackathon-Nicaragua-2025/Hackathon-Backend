import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { ApiResponseDto } from './common/dto/api-response.dto';

@ApiTags('AviFy - General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  @Public()
  @Get()
  getHello(): ApiResponseDto<string> {
    return ApiResponseDto.Success(
      this.appService.getHello(),
      'AviFy API',
      'AviFy - Plataforma de Aviturismo Nicaragua está funcionando correctamente'
    );
  }

  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  @Public()
  @Get('health')
  getHealth(): ApiResponseDto<{ status: string; timestamp: string }> {
    return ApiResponseDto.Success(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      'Health Check',
      'AviFy API está funcionando correctamente'
    );
  }
}
