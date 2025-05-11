import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = () => ({
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AdminService', () => {
  let service: AdminService;
  let userRepository: MockRepo<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const users = [{ id: '1' }, { id: '2' }] as User[];
      userRepository.findAndCount.mockResolvedValue([users, 2]);

      const result = await service.getAllUsers({ page: 1, pageSize: 2 });

      expect(userRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
      });
      expect(result.data).toEqual(users);
      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user if found', async () => {
      const user = { id: 'uuid' } as User;
      userRepository.findOne.mockResolvedValue(user);
      userRepository.delete.mockResolvedValue({});

      const result = await service.deleteUser({ id: 'uuid' });

      expect(userRepository.delete).toHaveBeenCalledWith('uuid');
      expect(result.message).toContain('uuid');
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser({ id: 'missing-id' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllPatients', () => {
    it('should return paginated patients', async () => {
      const patients = [{ id: 'p1' }] as User[];
      userRepository.findAndCount.mockResolvedValue([patients, 1]);

      const result = await service.getAllPatients({ page: 1, pageSize: 5 });

      expect(userRepository.findAndCount).toHaveBeenCalledWith({
        where: { role: UserRole.PATIENT },
        skip: 0,
        take: 5,
      });
      expect(result.data).toEqual(patients);
    });
  });

  describe('getPatient', () => {
    it('should return a patient by id', async () => {
      const patient = { id: '123', role: UserRole.PATIENT } as User;
      userRepository.findOne.mockResolvedValue(patient);

      const result = await service.getPatient('123');
      expect(result.data).toEqual(patient);
    });

    it('should throw NotFoundException if not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getPatient('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllDoctors', () => {
    it('should return paginated doctors', async () => {
      const doctors = [{ id: 'd1' }] as User[];
      userRepository.findAndCount.mockResolvedValue([doctors, 1]);

      const result = await service.getAllDoctors({ page: 1, pageSize: 5 });

      expect(userRepository.findAndCount).toHaveBeenCalledWith({
        where: { role: UserRole.DOCTOR },
        skip: 0,
        take: 5,
      });
      expect(result.data).toEqual(doctors);
    });
  });

  describe('getDoctor', () => {
    it('should return a doctor by id', async () => {
      const doctor = { id: '456', role: UserRole.DOCTOR } as User;
      userRepository.findOne.mockResolvedValue(doctor);

      const result = await service.getDoctor('456');
      expect(result.data).toEqual(doctor);
    });

    it('should throw NotFoundException if not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getDoctor('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
