import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    example: true,
    description: 'Indica si la operación fue exitosa',
  })
  success!: boolean;

  @ApiProperty({
    description: 'Datos de la respuesta',
  })
  data!: T;

  @ApiProperty({
    example: 'Operación Exitosa',
    description: 'Título del mensaje',
  })
  title!: string;

  @ApiProperty({
    example: 'La operación se completó correctamente',
    description: 'Descripción detallada del resultado',
  })
  message!: string;

  static Success<T>(data: T, title: string, message: string): ApiResponseDto<T> {
    const response = new ApiResponseDto<T>();
    response.success = true;
    response.data = data;
    response.title = title;
    response.message = message;
    return response;
  }

  static Error(title: string, message: string): ApiResponseDto<null> {
    const response = new ApiResponseDto<null>();
    response.success = false;
    response.data = null;
    response.title = title;
    response.message = message;
    return response;
  }
}
