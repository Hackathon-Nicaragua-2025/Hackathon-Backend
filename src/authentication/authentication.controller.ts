import { Controller, Post, Body, Get, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '../common/entities/app/user.entity';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { GetUser } from '../common/decorators';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';
import { TokenResponseDto } from './dto/token-response.dto';
import { TokenRequestDto } from './dto/token-request.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponseWithData(UserResponseDto, 'The user has been successfully created.', HttpStatus.CREATED) // Custom decorator
  @ApiResponseWithData(null, 'The user could not be created.', HttpStatus.BAD_REQUEST) // Custom decorator
  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.authenticationService.create(createUserDto);
    return ApiResponseDto.Success(user, 'User Registration', 'User has been successfully registered.');
  }

  @ApiOperation({ summary: 'Login an existing user' })
  @ApiResponseWithData(LoginResponseDto, 'Successfully logged in.', HttpStatus.OK)
  @ApiResponseWithData(null, 'Invalid credentials.', HttpStatus.BAD_REQUEST)
  @Public()
  @HttpCode(200)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<ApiResponseDto<LoginResponseDto>> {
    const result = await this.authenticationService.login(loginUserDto);
    return ApiResponseDto.Success(result, 'User Login', 'User has been successfully logged in.');
  }

  @ApiOperation({ summary: 'Refresh an authentication token' })
  @ApiResponseWithData(TokenResponseDto, 'Token successfully refreshed.', HttpStatus.CREATED)
  @ApiResponseWithData(null, 'Invalid refresh token.', HttpStatus.BAD_REQUEST)
  @Post('refresh-token')
  async refreshToken(@Body() tokenRequestDto: TokenRequestDto): Promise<ApiResponseDto<TokenResponseDto>> {
    const result = await this.authenticationService.refreshToken(tokenRequestDto.tokenRefresh);
    return ApiResponseDto.Success(result, 'Token Refresh', 'Token has been successfully refreshed.');
  }

  @ApiOperation({ summary: 'Retrieve the currently authenticated user' })
  @ApiResponseWithData(UserResponseDto, 'Successfully accessed private route.', HttpStatus.OK)
  @ApiResponseWithData(null, 'Unauthorized access.', HttpStatus.UNAUTHORIZED)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('me')
  async getAuthenticatedUser(@GetUser() user: User): Promise<ApiResponseDto<UserResponseDto>> {
    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return ApiResponseDto.Success(userResponse, 'Get User', 'User retrieved successfully.');
  }
}
