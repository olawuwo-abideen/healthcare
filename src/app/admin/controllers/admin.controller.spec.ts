import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from '../services/admin.service';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../shared/entities/user.entity';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';

const mockAdminService = {
  getAllUsers: jest.fn(),
  deleteUser: jest.fn(),
  getAllPatients: jest.fn(),
  getPatient: jest.fn(),
  getAllDoctors: jest.fn(),
  getDoctor: jest.fn(),
};

const mockAuthGuard = {
  canActivate: (context: ExecutionContext) => true,
};

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AdminController>(AdminController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all users', async () => {
    const dto: PaginationDto = { page: 1, pageSize: 10 };
    const result = [{ id: '1' }];
    mockAdminService.getAllUsers.mockResolvedValue(result);

    expect(await controller.getAllUsers(dto)).toEqual(result);
    expect(mockAdminService.getAllUsers).toHaveBeenCalledWith(dto);
  });

  it('should delete a user', async () => {
    const userId = 'uuid-123';
    const result = { success: true };
    mockAdminService.deleteUser.mockResolvedValue(result);

    expect(await controller.deleteUser(userId)).toEqual(result);
    expect(mockAdminService.deleteUser).toHaveBeenCalledWith({ id: userId });
  });

  it('should get all patients', async () => {
    const dto: PaginationDto = { page: 0, pageSize: 5 };
    const result = [{ id: 'p1' }];
    mockAdminService.getAllPatients.mockResolvedValue(result);

    expect(await controller.getAllPatients(dto)).toEqual(result);
    expect(mockAdminService.getAllPatients).toHaveBeenCalledWith(dto);
  });

  it('should get a single patient by id', async () => {
    const patientId = 'patient-uuid';
    const result = { id: patientId };
    mockAdminService.getPatient.mockResolvedValue(result);

    expect(await controller.getPatient(patientId)).toEqual(result);
    expect(mockAdminService.getPatient).toHaveBeenCalledWith(patientId);
  });

  it('should get all doctors', async () => {
    const dto: PaginationDto = { page: 1, pageSize: 5 };
    const result = [{ id: 'd1' }];
    mockAdminService.getAllDoctors.mockResolvedValue(result);

    expect(await controller.getAllDoctors(dto)).toEqual(result);
    expect(mockAdminService.getAllDoctors).toHaveBeenCalledWith(dto);
  });

  it('should get a single doctor by id', async () => {
    const doctorId = 'doctor-uuid';
    const result = { id: doctorId };
    mockAdminService.getDoctor.mockResolvedValue(result);

    expect(await controller.getDoctor(doctorId)).toEqual(result);
    expect(mockAdminService.getDoctor).toHaveBeenCalledWith(doctorId);
  });
});
