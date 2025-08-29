import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../common/entities/app/user.entity';

@ApiTags('AviFy - Autenticación')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.authenticationService.create(createUserDto);
    return ApiResponseDto.Success(user, 'Registro de Usuario', 'Usuario registrado exitosamente.');
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @Public()
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authenticationService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Renovar token de acceso' })
  @ApiResponse({ status: 200, description: 'Token renovado exitosamente' })
  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return await this.authenticationService.refreshToken(body.refreshToken);
  }

  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({ status: 200, description: 'Información del usuario obtenida' })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getCurrentUser(@GetUser() user: User): Promise<ApiResponseDto<UserResponseDto>> {
    return ApiResponseDto.Success(user, 'Usuario Actual', 'Información del usuario obtenida exitosamente.');
  }

  @ApiOperation({ summary: 'Enviar código de recuperación' })
  @ApiResponse({ status: 200, description: 'Código de recuperación enviado' })
  @Public()
  @Post('send-recovery-code')
  async sendRecoveryCode(@Body() body: { email: string }): Promise<ApiResponseDto<void>> {
    await this.authenticationService.sendPasswordRecoveryCode(body.email);
    return ApiResponseDto.Success(null, 'Código de Recuperación', 'Código de recuperación enviado exitosamente.');
  }

  @ApiOperation({ summary: 'Restablecer contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente' })
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string }): Promise<ApiResponseDto<void>> {
    await this.authenticationService.updatePassword(body.email, body.newPassword);
    return ApiResponseDto.Success(null, 'Restablecimiento de Contraseña', 'Contraseña restablecida exitosamente.');
  }
}
