import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: ApiResponseDto<LoginResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.authenticationService.login(loginUserDto);
    return ApiResponseDto.Success(result, 'Login Exitoso', 'Usuario autenticado correctamente.');
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: ApiResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Usuario ya existe o datos inválidos',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authenticationService.create(createUserDto);
    return ApiResponseDto.Success(user, 'Usuario Registrado', 'Usuario creado exitosamente.');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario',
    type: ApiResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getCurrentUser(@Request() req: any) {
    const user = req.user;
    return ApiResponseDto.Success(user, 'Usuario Actual', 'Información del usuario obtenida exitosamente.');
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acceso' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    type: ApiResponseDto<TokenResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de renovación inválido o expirado',
  })
  async refreshToken(@Body() body: { refreshToken: string }) {
    const result = await this.authenticationService.refreshToken(body.refreshToken);
    return ApiResponseDto.Success(result, 'Token Renovado', 'Token de acceso renovado exitosamente.');
  }
}
