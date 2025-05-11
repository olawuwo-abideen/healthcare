import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, Gender, UserRole, DoctorSpecilization } from '../../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../../shared/cloudinary/services/cloudinary.service';
import * as bcryptjs from 'bcryptjs';

jest.mock('bcryptjs');

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  existsBy: jest.fn(),
});

const mockCloudinaryService = () => ({
  uploadFile: jest.fn(),
});

const mockUser: User = {
  id: '1',
  firstname: 'John',
  lastname: 'Doe',
  age: 30,
  email: 'john@example.com',
  phonenumber: '08012345678',
  password: 'hashedPassword',
  role: UserRole.DOCTOR,
  gender: Gender.MALE,
  resetToken: null,
  userimage: 'image-url',
  specialization: null,
  experienceyears: null,
  clinicaddress: null,
  availabilitySlots: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  toJSON: jest.fn(),
  appointments: [],
  prescriptions: [],
  reviews: [],
  medicalrecords: [],
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: CloudinaryService, useFactory: mockCloudinaryService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const user = await service.findOne({ id: '1' });
      expect(user).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      const user = await service.create(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should update the user password', async () => {
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
      (bcryptjs.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      userRepository.update.mockResolvedValue({} as any);

      const dto = {
        currentPassword: 'oldPassword',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      const result = await service.changePassword(dto, { ...mockUser });
      expect(result).toEqual({ message: 'Password updated successfully' });
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user', async () => {
      userRepository.save.mockResolvedValue(mockUser);
      const dto = {
        firstname: 'Jane',
        lastname: 'Doe',
        age: 28,
        phonenumber: '09098765432',
        gender: Gender.FEMALE,
      };

      const result = await service.updateProfile(dto, { ...mockUser });
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('user');
      expect(result.user.firstname).toEqual('Jane');
    });
  });

  describe('updateDoctorProfile', () => {
    it('should update and return the doctor user', async () => {
      userRepository.save.mockResolvedValue(mockUser);
      const dto = {
        firstname: 'Jane',
        lastname: 'Doe',
        age: 35,
        phonenumber: '08099887766',
        gender: Gender.FEMALE,
        specialization: DoctorSpecilization.CARDIOLOGY,
        experienceyears: 5,
        clinicaddress: '123 Clinic Street',
      };

      const result = await service.updateDoctorProfile(dto, { ...mockUser });
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('user');
      expect(result.user.specialization).toEqual('cardiology');
    });
  });

  describe('updateUserImage', () => {
    it('should upload image and update user', async () => {
      cloudinaryService.uploadFile = jest.fn().mockResolvedValue({ secure_url: 'http://image.url' });
      userRepository.save.mockResolvedValue(mockUser);
      const file = { originalname: 'image.jpg', buffer: Buffer.from('') } as Express.Multer.File;

      const result = await service.updateUserImage(file, { ...mockUser });
      expect(result.userimage).toEqual('http://image.url');
    });
  });
});
