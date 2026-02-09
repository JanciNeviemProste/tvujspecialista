import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../database/entities/user.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SpecialistCategory } from '../database/entities/specialist.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/slug-generator', () => ({
  generateSlug: jest.fn().mockReturnValue('john-doe-finance-prague'),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let specialistRepository: jest.Mocked<Repository<Specialist>>;
  let refreshTokenRepository: jest.Mocked<Repository<RefreshToken>>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'user-123',
    email: 'john@example.com',
    password: 'hashed_password',
    name: 'John Doe',
    phone: '+420123456789',
    role: UserRole.SPECIALIST,
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    slug: 'john-doe-finance-prague',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+420123456789',
    category: SpecialistCategory.FINANCIAL_ADVISOR,
    location: 'Prague',
  } as Specialist;

  const mockRefreshToken = {
    id: 'token-123',
    userId: 'user-123',
    token: 'refresh_token_value',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(),
  } as RefreshToken;

  const mockRegisterDto: RegisterDto = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+420123456789',
    category: SpecialistCategory.FINANCIAL_ADVISOR,
    location: 'Prague',
    yearsExperience: 5,
  };

  const mockLoginDto: LoginDto = {
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Specialist),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_jwt_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                JWT_EXPIRATION: '15m',
                JWT_REFRESH_EXPIRATION: '7d',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    specialistRepository = module.get(getRepositoryToken(Specialist));
    refreshTokenRepository = module.get(getRepositoryToken(RefreshToken));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create user and specialist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      specialistRepository.create.mockReturnValue(mockSpecialist);
      specialistRepository.save.mockResolvedValue(mockSpecialist);
      refreshTokenRepository.save.mockResolvedValue(mockRefreshToken);

      const result = await service.register(mockRegisterDto);

      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockRegisterDto.email,
          name: mockRegisterDto.name,
          phone: mockRegisterDto.phone,
          role: UserRole.SPECIALIST,
        }),
      );
      expect(userRepository.save).toHaveBeenCalled();
      expect(specialistRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          slug: 'john-doe-finance-prague',
          name: mockRegisterDto.name,
          email: mockRegisterDto.email,
          category: mockRegisterDto.category,
          location: mockRegisterDto.location,
        }),
      );
      expect(specialistRepository.save).toHaveBeenCalled();
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
    });

    it('should hash password', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      specialistRepository.create.mockReturnValue(mockSpecialist);
      specialistRepository.save.mockResolvedValue(mockSpecialist);
      refreshTokenRepository.save.mockResolvedValue(mockRefreshToken);

      await service.register(mockRegisterDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashed_password',
        }),
      );
    });

    it('should return access and refresh tokens', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      specialistRepository.create.mockReturnValue(mockSpecialist);
      specialistRepository.save.mockResolvedValue(mockSpecialist);
      refreshTokenRepository.save.mockResolvedValue(mockRefreshToken);

      const result = await service.register(mockRegisterDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.refreshToken).toBe('mock_jwt_token');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException if email exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        'Email already registered',
      );
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      refreshTokenRepository.save.mockResolvedValue(mockRefreshToken);

      const result = await service.login(mockLoginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.role).toBe(mockUser.role);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new access token for valid refresh token', async () => {
      refreshTokenRepository.findOne.mockResolvedValue(mockRefreshToken);
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.refreshToken('refresh_token_value');

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('mock_jwt_token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
        {
          expiresIn: '15m',
        },
      );
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      refreshTokenRepository.findOne.mockResolvedValue(null);

      await expect(service.refreshToken('invalid_token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken('invalid_token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException for expired refresh token', async () => {
      const expiredToken = {
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
      } as RefreshToken;
      refreshTokenRepository.findOne.mockResolvedValue(expiredToken);
      refreshTokenRepository.delete.mockResolvedValue({} as any);

      await expect(service.refreshToken('expired_token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken('expired_token')).rejects.toThrow(
        'Refresh token expired',
      );
    });
  });

  describe('logout', () => {
    it('should delete refresh tokens for user', async () => {
      refreshTokenRepository.delete.mockResolvedValue({} as any);

      await service.logout('user-123');

      expect(refreshTokenRepository.delete).toHaveBeenCalledWith({
        userId: 'user-123',
      });
    });
  });
});
