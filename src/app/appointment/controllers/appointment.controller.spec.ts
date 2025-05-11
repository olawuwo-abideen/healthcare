import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from '../controllers/appointment.controller';
import { AppointmentService } from '../services/appointment.service';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { RolesGuard } from '../../../app/auth/guards/role.guard';
import { UserRole } from '../../../shared/entities/user.entity';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  const mockAppointmentService = {
    bookAppointment: jest.fn(),
    getPatientAppointments: jest.fn(),
    getDoctorAppointments: jest.fn(),
    getAppointmentDetails: jest.fn(),
    updateAppointment: jest.fn(),
    rescheduleAppointment: jest.fn(),
    cancelAppointment: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('bookAppointment', () => {
    it('should book an appointment', async () => {
      const user = { id: 'user-id', role: UserRole.PATIENT };
      const dto = {
        doctorId: 'doc-id',
        availabilitySlotId: 'slot-id',
      };
      const expected = { message: 'Booked', data: {} };

      mockAppointmentService.bookAppointment.mockResolvedValue(expected);

      const result = await controller.bookAppointment(user as any, dto);

      expect(result).toEqual(expected);
      expect(service.bookAppointment).toHaveBeenCalledWith(user, dto);
    });
  });

  describe('getPatientAppointments', () => {
    it('should get patient appointments', async () => {
      const user = { id: 'user-id', role: UserRole.PATIENT };
      const expected = { message: 'Appointments', data: [] };

      mockAppointmentService.getPatientAppointments.mockResolvedValue(expected);

      const result = await controller.getPatientAppointments(user as any);

      expect(result).toEqual(expected);
    });
  });

  describe('getAppointmentsByDoctor', () => {
    it('should get doctor appointments', async () => {
      const user = { id: 'doc-id', role: UserRole.DOCTOR };
      const expected = { message: 'Appointments', data: [] };

      mockAppointmentService.getDoctorAppointments.mockResolvedValue(expected);

      const result = await controller.getAppointmentsByDoctor(user as any);

      expect(result).toEqual(expected);
    });
  });

  describe('getAppointmentDetails', () => {
    it('should get appointment details', async () => {
      const user = { id: 'user-id', role: UserRole.PATIENT };
      const id = 'appointment-id';
      const expected = { message: 'Details', data: {} };

      mockAppointmentService.getAppointmentDetails.mockResolvedValue(expected);

      const result = await controller.getAppointmentDetails(user as any, id);

      expect(result).toEqual(expected);
    });
  });

  describe('updateAppointment', () => {
    it('should update appointment', async () => {
      const user = { id: 'user-id', role: UserRole.DOCTOR };
      const id = 'appointment-id';
      const dto = { doctorId: 'new-doc-id', availabilitySlotId: 'new-slot-id' };
      const expected = { message: 'Updated', data: {} };

      mockAppointmentService.updateAppointment.mockResolvedValue(expected);

      const result = await controller.updateAppointment(user as any, id, dto);

      expect(result).toEqual(expected);
    });
  });

  describe('rescheduleAppointment', () => {
    it('should reschedule appointment', async () => {
      const appointmentId = 'appointment-id';
      const newSlotId = 'new-slot-id';
      const expected = { message: 'Rescheduled', data: {} };

      mockAppointmentService.rescheduleAppointment.mockResolvedValue(expected);

      const result = await controller.rescheduleAppointment(appointmentId, newSlotId);

      expect(result).toEqual(expected);
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel appointment', async () => {
      const user = { id: 'user-id', role: UserRole.PATIENT };
      const id = 'appointment-id';
      const expected = { message: 'Cancelled' };

      mockAppointmentService.cancelAppointment.mockResolvedValue(expected);

      const result = await controller.cancelAppointment(user as any, id);

      expect(result).toEqual(expected);
    });
  });
});
