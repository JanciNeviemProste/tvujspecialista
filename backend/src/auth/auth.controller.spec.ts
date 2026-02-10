import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { UserRole } from '../database/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockRegisterDto = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+420123456789',
    category: 'Finan\u010Dn\u00ED poradce' as any,
    location: 'Prague',
    yearsExperience: 5,
  };

  const mockLoginDto = {
    email: 'john@example.com',
    password: 'password123',
  };

  const mockTokenResponse = {
    accessToken: 'access_token_123',
    refreshToken: 'refresh_token_123',
    user: {
      id: 'user-123',
      email: 'john@example.com',
      name: 'John Doe',
      role: UserRole.SPECIALIST,
    },
  };

  const mockRequest = {
    user: {
      userId: 'user-123',
      email: 'john@example.com',
      role: UserRole.SPECIALIST,
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            getProfile: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with DTO', async () => {
      authService.register.mockResolvedValue(mockTokenResponse);

      const result = await controller.register(mockRegisterDto);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login with DTO', async () => {
      authService.login.mockResolvedValue(mockTokenResponse);

      const result = await controller.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken', async () => {
      const refreshTokenDto = { refreshToken: 'refresh_token_123' };
      const accessTokenResponse = { accessToken: 'new_access_token' };
      authService.refreshToken.mockResolvedValue(accessTokenResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        'refresh_token_123',
      );
      expect(result).toEqual(accessTokenResponse);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with userId', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'john@example.com',
        name: 'John Doe',
        role: UserRole.SPECIALIST,
        verified: true,
      };
      authService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockRequest);

      expect(authService.getProfile).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with userId', async () => {
      authService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest);

      expect(authService.logout).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('Guard Integration', () => {
    it('should apply JwtAuthGuard to getProfile', () => {
      const guards = Reflect.getMetadata('__guards__', controller.getProfile);
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });

    it('should apply JwtAuthGuard to logout', () => {
      const guards = Reflect.getMetadata('__guards__', controller.logout);
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });
  });
});
