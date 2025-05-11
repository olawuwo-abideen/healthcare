import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/reset-password.dto';
import { Response } from 'express';
import { User, UserRole } from '../../../shared/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct data', async () => {
      const signupDto: SignupDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        phonenumber: '09012345678',
        password: 'Password123--',
        confirmPassword: 'Password123--',
        role: UserRole.PATIENT,
      };

      const result = { message: 'User created' };
      mockAuthService.signup.mockResolvedValue(result);

      expect(await controller.signup(signupDto)).toBe(result);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct credentials', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'Password123--',
      };

      const result = { accessToken: 'token' };
      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with email', async () => {
      const forgotDto: ForgotPasswordDto = { email: 'john@example.com' };
      const result = { message: 'Token sent' };
      mockAuthService.forgotPassword.mockResolvedValue(result);

      expect(await controller.forgotPassword(forgotDto)).toBe(result);
      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotDto.email);
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword with payload', async () => {
      const resetDto: ResetPasswordDto = {
        password: 'Password123--',
        confirmPassword: 'Password123--',
        token: 'reset-token',
      };

      await controller.resetPassword(resetDto);
      expect(authService.resetPassword).toHaveBeenCalledWith(resetDto);
    });
  });

  describe('signOut', () => {
    it('should call authService.logout with user and response', async () => {
      const user: Partial<User> = { id: '123', email: 'john@example.com' };
      const res = {
        clearCookie: jest.fn(),
        json: jest.fn(),
      } as any as Response;

      const result = { message: 'Logged out' };
      mockAuthService.logout.mockResolvedValue(result);

      expect(await controller.signOut(user, res)).toBe(result);
      expect(authService.logout).toHaveBeenCalledWith(user, res);
    });
  });
});
