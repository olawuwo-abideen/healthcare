import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../../shared/modules/email/email.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { Repository, EntityManager } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let entityManager: Partial<EntityManager>;
  let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    } as any;

    userService = {
      findOne: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    configService = {
      get: jest.fn(),
    } as any;

    entityManager = {
      transaction: jest.fn(),
    };

    emailService = {
      sendResetPasswordLink: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: EmailService, useValue: emailService },
        { provide: EntityManager, useValue: entityManager },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phonenumber: '09012345678',
      password: 'Password123--',
      confirmPassword: 'Password123--',
      role: UserRole.PATIENT,
    };

    it('should throw ConflictException if email exists', async () => {
      userRepository.findOne.mockResolvedValueOnce({ id: '1' } as any);

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if phone number exists', async () => {
      userRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: '2' } as any);

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ id: '1', ...signupDto } as any);

      (entityManager.transaction as jest.Mock).mockImplementation(async (cb) =>
        cb({
          save: jest.fn().mockResolvedValue({ id: '1', ...signupDto }),
        } as any),
      );

      const result = await service.signup(signupDto);
      expect(result).toEqual({
        message: 'User signup sucessfully',
        user: expect.objectContaining({ id: '1', email: signupDto.email }),
      });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'Password123--',
    };

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      userService.findOne.mockResolvedValue({ password: 'hashed' } as any);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return user and token on success', async () => {
      const user = { id: '1', password: 'hashed' } as any;
      userService.findOne.mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      const result = await service.login(loginDto);
      expect(result).toEqual({
        message: 'User login sucessfully',
        token: 'token',
        user,
      });
    });
  });
});
