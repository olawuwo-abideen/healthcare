import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from '../services/appointment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from '../../../shared/entities/appointment.entity';
import { User } from '../../../shared/entities/user.entity';
import { AvailabilitySlot } from '../../../shared/entities/availabilityslot.entity';
import { Repository } from 'typeorm';
import { BookAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentRepo: Repository<Appointment>;
  let userRepo: Repository<User>;
  let slotRepo: Repository<AvailabilitySlot>;

  const mockAppointmentRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockSlotRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: getRepositoryToken(Appointment), useValue: mockAppointmentRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(AvailabilitySlot), useValue: mockSlotRepo },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    appointmentRepo = module.get(getRepositoryToken(Appointment));
    userRepo = module.get(getRepositoryToken(User));
    slotRepo = module.get(getRepositoryToken(AvailabilitySlot));

    jest.clearAllMocks();
  });

  describe('bookAppointment', () => {
    it('should book an appointment', async () => {
      const user = { id: 'user-id' } as User;
      const dto: BookAppointmentDto = {
        doctorId: 'doc-id',
        availabilitySlotId: 'slot-id',
      };

      const doctor = { id: 'doc-id' } as User;
      const slot = { id: 'slot-id', isAvailable: true } as AvailabilitySlot;
      const appointment = { id: 'appt-id' } as Appointment;

      mockUserRepo.findOne.mockResolvedValue(doctor);
      mockSlotRepo.findOne.mockResolvedValue(slot);
      mockAppointmentRepo.create.mockReturnValue(appointment);
      mockAppointmentRepo.save.mockResolvedValue(appointment);

      const result = await service.bookAppointment(user, dto);

      expect(result).toEqual({
        message: 'Appointment booked successfully',
        appointment,
      });
      expect(mockSlotRepo.update).toHaveBeenCalledWith(slot.id, { isAvailable: false });
    });

    it('should throw NotFoundException if doctor or slot not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockSlotRepo.findOne.mockResolvedValue(null);

      await expect(
        service.bookAppointment({} as User, {
          doctorId: 'doc-id',
          availabilitySlotId: 'slot-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if slot is not available', async () => {
      mockUserRepo.findOne.mockResolvedValue({} as User);
      mockSlotRepo.findOne.mockResolvedValue({ isAvailable: false });

      await expect(
        service.bookAppointment({} as User, {
          doctorId: 'doc-id',
          availabilitySlotId: 'slot-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPatientAppointments', () => {
    it('should return patient appointments', async () => {
      const appointments = [{}] as Appointment[];
      mockAppointmentRepo.find.mockResolvedValue(appointments);

      const result = await service.getPatientAppointments({ id: '123' } as User);

      expect(result).toEqual({
        message: 'Patient appointments retrieved successfully',
        data: appointments,
      });
    });
  });

  describe('getDoctorAppointments', () => {
    it('should return doctor appointments', async () => {
      const appointments = [{}] as Appointment[];
      mockAppointmentRepo.find.mockResolvedValue(appointments);

      const result = await service.getDoctorAppointments({ id: 'doc123' } as User);

      expect(result).toEqual({
        message: 'Doctor appointments retrieved successfully',
        data: appointments,
      });
    });
  });

  describe('getAppointmentDetails', () => {
    it('should return appointment details', async () => {
      const appointment = {} as Appointment;
      mockAppointmentRepo.findOne.mockResolvedValue(appointment);

      const result = await service.getAppointmentDetails({ id: 'user-id' } as User, 'appt-id');

      expect(result).toEqual({
        message: 'Appointment details retrieved successfully',
        data: appointment,
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockAppointmentRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getAppointmentDetails({ id: 'user-id' } as User, 'appt-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAppointment', () => {
    it('should update appointment successfully', async () => {
      const appointment = {
        id: 'appt-id',
        availabilitySlot: { isAvailable: false },
      } as unknown as Appointment;
      const doctor = {} as User;
      const newSlot = { id: 'slot2', isAvailable: true } as AvailabilitySlot;

      mockAppointmentRepo.findOne.mockResolvedValue(appointment);
      mockUserRepo.findOne.mockResolvedValue(doctor);
      mockSlotRepo.findOne.mockResolvedValue(newSlot);
      mockAppointmentRepo.save.mockResolvedValue(appointment);

      const result = await service.updateAppointment(
        { id: 'user-id' } as User,
        'appt-id',
        { doctorId: 'doc-id', availabilitySlotId: 'slot2' },
      );

      expect(result.message).toBe('Appointment updated successfully');
      expect(mockSlotRepo.save).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if appointment not found', async () => {
      mockAppointmentRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateAppointment({ id: 'user-id' } as User, 'id', {
          doctorId: 'd',
          availabilitySlotId: 's',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('rescheduleAppointment', () => {
    it('should reschedule successfully', async () => {
      const appointment = {
        id: 'appt-id',
        availabilitySlot: { isAvailable: false },
      } as unknown as Appointment;

      const newSlot = { id: 'slot2', isAvailable: true } as AvailabilitySlot;

      mockAppointmentRepo.findOne.mockResolvedValue(appointment);
      mockSlotRepo.findOne.mockResolvedValue(newSlot);
      mockAppointmentRepo.save.mockResolvedValue(appointment);

      const result = await service.rescheduleAppointment('appt-id', 'slot2');

      expect(result.message).toBe('Appointment rescheduled successfully');
    });

    it('should throw if new slot is unavailable', async () => {
      mockAppointmentRepo.findOne.mockResolvedValue({} as Appointment);
      mockSlotRepo.findOne.mockResolvedValue({ isAvailable: false });

      await expect(service.rescheduleAppointment('appt-id', 'slot2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel appointment', async () => {
      const appointment = {
        availabilitySlot: { isAvailable: false },
      } as unknown as Appointment;

      mockAppointmentRepo.findOne.mockResolvedValue(appointment);

      const result = await service.cancelAppointment({ id: 'user-id' } as User, 'appt-id');

      expect(result).toEqual({ message: 'Appointment canceled successfully' });
      expect(mockAppointmentRepo.remove).toHaveBeenCalled();
    });

    it('should throw if appointment not found', async () => {
      mockAppointmentRepo.findOne.mockResolvedValue(null);

      await expect(service.cancelAppointment({ id: 'user-id' } as User, 'appt-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
