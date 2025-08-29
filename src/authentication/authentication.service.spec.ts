import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasherService } from '../common/services/password-hasher.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../common/entities/app/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from '../common/entities/app/refresh-token.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '../common/exceptions/custom-exceptions';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let jwtService: JwtService;
  let passwordHasherService: PasswordHasherService;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_ACCESS_TOKEN_EXPIRES_IN') return '3600s';
              if (key === 'JWT_REFRESH_TOKEN_EXPIRES_IN') return '1d';
            }),
          },
        },
        {
          provide: PasswordHasherService,
          useValue: {
            hashPassword: jest.fn(),
            comparePasswords: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(), // Mocking findOne on the userRepository
            manager: {
              transaction: jest.fn(),
              findOne: jest.fn(),
              save: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
    passwordHasherService = module.get<PasswordHasherService>(PasswordHasherService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokenRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
  });

  describe('create', () => {
    it('should create a new user and return a UserResponseDto', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'Password123',
        roles: [], // Simulate no roles for this test
      };

      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'hashedPassword',
        isActive: true,
        roles: [], // Simulate no roles assigned
        refreshToken: {
          id: 1,
          refreshToken: 'fakeToken',
          user: {} as User,
          expiresAt: new Date(),
        },
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
      };

      // Mock repository.manager.transaction to simulate the transaction
      jest.spyOn(userRepository.manager, 'transaction').mockImplementation(async (transactionFn: any) => {
        // Mock EntityManager used inside the transaction
        const entityManagerMock = {
          findOne: jest.fn().mockResolvedValueOnce(null), // No existing user
          save: jest.fn().mockResolvedValueOnce(user), // Simulate saving the user
          create: jest.fn().mockReturnValueOnce(user), // Simulate user creation
          find: jest.fn().mockResolvedValueOnce([]), // Mock role lookup, returns empty roles
        };

        // Call the transaction callback with the mocked EntityManager
        return transactionFn(entityManagerMock);
      });

      // Mock hashPassword to return hashed password
      jest.spyOn(passwordHasherService, 'hashPassword').mockResolvedValueOnce('hashedPassword');

      // Call the create method and verify the result
      const result = await authService.create(createUserDto);
      expect(result).toEqual(plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }));
    });

    it('should throw a BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'Password123',
        roles: [],
      };

      const existingUser = {
        id: 1,
        email: 'john.doe@example.com',
      } as User;

      // Mock transaction to simulate an existing user being found
      jest.spyOn(userRepository.manager, 'transaction').mockImplementation(async (transactionFn: any) => {
        const entityManagerMock = {
          findOne: jest.fn().mockResolvedValueOnce(existingUser), // User already exists
          save: jest.fn(),
          create: jest.fn(),
        };
        return transactionFn(entityManagerMock);
      });

      await expect(authService.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login the user and return a LoginResponseDto', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'hashedPassword',
        isActive: true,
        roles: [],
        refreshToken: {
          id: 1,
          refreshToken: 'fakeToken',
          user: {} as User,
          expiresAt: new Date(),
        },
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
      };

      const refreshTokenEntity = {
        id: 1,
        refreshToken: 'refreshToken',
        expiresAt: new Date(),
        user,
      };

      // Mock findOne to return a user
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      // Mock comparePasswords to return true
      jest.spyOn(passwordHasherService, 'comparePasswords').mockResolvedValueOnce(true);

      // Mock jwtService.sign to generate tokens
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce('refreshToken') // First call for refresh token
        .mockReturnValueOnce('jwtToken'); // Second call for access token

      // Mock the create and save function of the refreshTokenRepository
      jest.spyOn(refreshTokenRepository, 'create').mockReturnValueOnce(refreshTokenEntity);
      jest.spyOn(refreshTokenRepository, 'save').mockResolvedValueOnce(refreshTokenEntity as any);

      // Execute the login function
      const result = await authService.login(loginUserDto);

      // Verify the result
      expect(result.token).toEqual('jwtToken');
      expect(result.refreshToken).toEqual('refreshToken');
    });

    it('should throw UnauthorizedException if user is not active or password is incorrect', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'hashedPassword',
        isActive: false, // Simulate inactive user
        roles: [],
        refreshToken: {
          id: 1,
          refreshToken: 'fakeToken',
          user: {} as User,
          expiresAt: new Date(),
        },
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
      };

      // Mock findOne to return a user
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      // Test for inactive user
      await expect(authService.login(loginUserDto)).rejects.toThrow(UnauthorizedException);

      // Now mock for incorrect password
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(passwordHasherService, 'comparePasswords').mockResolvedValueOnce(false);

      await expect(authService.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token if the refresh token is valid', async () => {
      const refreshTokenString = 'someRefreshToken';

      const refreshTokenEntity: RefreshToken = {
        id: 1,
        refreshToken: refreshTokenString,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Valid expiry (1 hour from now)
        user: {} as User,
      };

      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'hashedPassword',
        isActive: true,
        roles: [],
        refreshToken: {
          id: 1,
          refreshToken: refreshTokenString, // Make sure it matches the input refreshToken
          user: {} as User,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Ensure expiration matches
        },
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
      };

      // Mock verify method of jwtService to return the decoded payload
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id: user.id });

      // Mock findOne to return the refresh token entity
      jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValueOnce(refreshTokenEntity);

      // Mock findOne on userRepository to return the user
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      // Mock sign method of jwtService to return a new access token
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('newAccessToken');

      // Act: Call refreshToken method on authService
      const result = await authService.refreshToken(refreshTokenString);

      // Assert: Expect the token to be the newly signed token
      expect(result.token).toEqual('newAccessToken');
    });

    it('should throw UnauthorizedException if the refresh token is expired or invalid', async () => {
      const expiredRefreshTokenString = 'expiredRefreshToken';

      const expiredRefreshTokenEntity: RefreshToken = {
        id: 1,
        refreshToken: expiredRefreshTokenString,
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // Expired expiry
        user: {} as User,
      };

      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 25,
        password: 'hashedPassword',
        isActive: true,
        roles: [],
        refreshToken: {
          id: 1,
          refreshToken: 'fakeToken',
          user: {} as User,
          expiresAt: new Date(),
        },
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
      };

      // Mock verify method of jwtService to return the decoded payload
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id: user.id });

      // Mock findOne to return the expired refresh token
      jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValueOnce(expiredRefreshTokenEntity);

      await expect(authService.refreshToken(expiredRefreshTokenString)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
