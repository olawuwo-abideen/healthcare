import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import RequestWithUser from '../../../shared/dtos/request-with-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateDoctorProfileDto } from '../../user/dto/update-profile.dto';
import { User, Gender, DoctorSpecilization } from '../../../shared/entities/user.entity';

const mockUserService = {
  getProfile: jest.fn().mockResolvedValue({ message: 'Profile retrieved', user: { id: 1, name: 'John' } }),
  changePassword: jest.fn().mockResolvedValue({ message: 'Password changed' }),
  updateProfile: jest.fn().mockResolvedValue({ message: 'Profile updated', user: { id: 1, name: 'John Updated' } }),
  updateDoctorProfile: jest.fn().mockResolvedValue({ message: 'Doctor profile updated', user: { id: 1, name: 'Dr. John' } }),
  updateUserImage: jest.fn().mockResolvedValue({ id: 1, imageUrl: 'path/to/image.png' }),
};

class MockAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = {
      id: 1,
      email: 'john@example.com',
      phonenumber: '123456789',
      gender: Gender.MALE,
      availabilitySlots: [],
    } as unknown as User;
    return true;
  }
}

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        Reflector,
        ConfigService,
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = { user: { id: 1 } } as unknown as RequestWithUser;
      const result = await controller.getProfile(req);
      expect(result).toEqual({ message: 'Profile retrieved', user: { id: 1, name: 'John' } });
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const dto = new ChangePasswordDto();
      dto.currentPassword = 'old';
      dto.password = 'new';
      dto.confirmPassword = 'new';

      const req = { user: { id: 1 } } as unknown as RequestWithUser;
      const result = await controller.changePassword(dto, req);
      expect(result).toEqual({ message: 'Password changed' });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const dto = new UpdateProfileDto();
      dto.firstname = 'John';
      dto.lastname = 'Updated';
      dto.age = 30;
      dto.phonenumber = '123456789';
      dto.gender = Gender.MALE;

      const req = { user: { id: 1 } } as unknown as RequestWithUser;
      const result = await controller.updateProfile(dto, req);
      expect(result).toEqual({ message: 'Profile updated', user: { id: 1, name: 'John Updated' } });
    });
  });

  describe('updateDoctorProfile', () => {
    it('should update doctor profile', async () => {
      const dto = new UpdateDoctorProfileDto();
      dto.firstname = 'John';
      dto.lastname = 'Doe';
      dto.age = 40;
      dto.phonenumber = '987654321';
      dto.gender = Gender.MALE;
      dto.specialization = DoctorSpecialization.CARDIOLOGY;
      dto.experienceyears = 10; // Make sure this property exists in DTO
      dto.clinicaddress = 'Experienced cardiologist'; // Make sure this property exists in DTO

      const req = { user: { id: 1 } } as unknown as RequestWithUser;
      const result = await controller.updateDoctorProfile(dto, req);
      expect(result).toEqual({ message: 'Doctor profile updated', user: { id: 1, name: 'Dr. John' } });
    });
  });

  describe('updateUserImage', () => {
    it('should update user image', async () => {
      const file = { path: 'path/to/image.png' } as any;
      const user = {
        id: 1,
        email: 'john@example.com',
        phonenumber: '123456789',
        gender: Gender.MALE,
        availabilitySlots: [],
      } as unknown as User;

      const result = await controller.updateUserImage(file, user);
      expect(result).toEqual({ id: 1, imageUrl: 'path/to/image.png' });
    });
  });
});
