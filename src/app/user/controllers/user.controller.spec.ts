import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto, UpdateDoctorProfileDto } from '../dto/update-profile.dto';
import { UserRole, Gender, DoctorSpecilization } from '../../../shared/entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    phonenumber: '08012345678',
    role: UserRole.PATIENT,
    password: 'qwdsqqqq9988ee-2',
  };

  const mockUserService = {
    profile: jest.fn(),
    changePassword: jest.fn(),
    updateProfile: jest.fn(),
    updateDoctorProfile: jest.fn(),
    updateUserImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user profile', async () => {
    mockUserService.profile.mockResolvedValue({ ...mockUser });
    const result = await controller.getProfile({ user: mockUser } as any);
    expect(result).toEqual(mockUser);
    expect(mockUserService.profile).toHaveBeenCalledWith(mockUser);
  });

  it('should change user password', async () => {
    const dto: ChangePasswordDto = {
      currentPassword: 'OldPass123!',
      password: 'NewPass123!',
      confirmPassword: 'NewPass123!',
    };

    mockUserService.changePassword.mockResolvedValue({ message: 'Password changed' });
    const result = await controller.changePassword(dto, mockUser as any);
    expect(result).toEqual({ message: 'Password changed' });
    expect(mockUserService.changePassword).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should update user profile', async () => {
    const dto: UpdateProfileDto = {
      firstname: 'John',
      lastname: 'Doe',
      age: 30,
      phonenumber: '08012345678',
      gender: Gender.MALE,
    };

    mockUserService.updateProfile.mockResolvedValue({ ...dto });
    const result = await controller.updateProfile(dto, mockUser as any);
    expect(result).toEqual(dto);
    expect(mockUserService.updateProfile).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should update doctor profile', async () => {
    const dto: UpdateDoctorProfileDto = {
      firstname: 'Doc',
      lastname: 'Smith',
      age: 45,
      phonenumber: '08098765432',
      gender: Gender.FEMALE,
      specialization: DoctorSpecilization.CARDIOLOGY,
      experienceyears: 10,
      clinicaddress: '123 Clinic Rd',
    };

    const doctorUser = { ...mockUser, role: UserRole.DOCTOR };

    mockUserService.updateDoctorProfile.mockResolvedValue({ ...dto });
    const result = await controller.updateDoctorProfile(dto, doctorUser as any);
    expect(result).toEqual(dto);
    expect(mockUserService.updateDoctorProfile).toHaveBeenCalledWith(dto, doctorUser);
  });

  it('should update user profile image', async () => {
    const file = { originalname: 'image.png' } as Express.Multer.File;
    mockUserService.updateUserImage.mockResolvedValue({ userimage: 'uploaded/image.png' });

    const result = await controller.updateUserImage(file, mockUser as any);
    expect(result).toEqual({ userimage: 'uploaded/image.png' });
    expect(mockUserService.updateUserImage).toHaveBeenCalledWith(file, mockUser);
  });
});
