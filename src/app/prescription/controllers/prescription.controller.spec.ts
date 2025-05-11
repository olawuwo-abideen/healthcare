import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionController } from '../controllers/prescription.controller';
import { PrescriptionService } from '../services/prescription.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { NotFoundException } from '@nestjs/common';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from '../dto/prescription.dto';
import { UserService } from '../../user/services/user.service'

describe('PrescriptionController', () => {
  let controller: PrescriptionController;
  let prescriptionService: PrescriptionService;
  let jwtService: JwtService;
  let userService: UserService;

  const mockUser = {
    id: 'user-id',
    role: UserRole.DOCTOR,
  } as User;

  const mockPatientId = 'patient-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrescriptionController],
      providers: [
        {
          provide: PrescriptionService,
          useValue: {
            createPrescription: jest.fn(),
            getPrescription: jest.fn(),
            updatePrescription: jest.fn(),
          },
        },
        JwtService, 
        ConfigService, 
        Reflector,
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true), 
          },
        },
        {
          provide: UserService, 
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser), 
          },
        },
      ],
    }).compile();

    controller = module.get<PrescriptionController>(PrescriptionController);
    prescriptionService = module.get<PrescriptionService>(PrescriptionService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService); 
  });

  describe('getPrescription', () => {
    it('should return a prescription', async () => {
      const result = { message: 'Prescription retrieved successfully', data: [{}] };
      jest.spyOn(prescriptionService, 'getPrescription').mockResolvedValue(result);

      const response = await controller.getPrescription(mockUser, mockPatientId);

      expect(response.message).toBe('Prescription retrieved successfully');
      expect(response.data).toEqual([{}]);
      expect(prescriptionService.getPrescription).toHaveBeenCalledWith(mockUser, mockPatientId);
    });

    it('should throw NotFoundException if prescription not found', async () => {
      const error = new NotFoundException('Prescription not found');
      jest.spyOn(prescriptionService, 'getPrescription').mockRejectedValue(error);

      await expect(controller.getPrescription(mockUser, mockPatientId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createPrescription', () => {
    it('should create a new prescription', async () => {
      const createPrescriptionDto: CreatePrescriptionDto = {
        medicine: 'Paracetamol',
        dosage: '6 Tablets per day',
        instructions: 'Take two tablets after each meal',
      };

      const result = {
        message: 'Prescription created successfully',
        data: [{}],
      };

      jest.spyOn(prescriptionService, 'createPrescription').mockResolvedValue(result);

      const response = await controller.createPrescription(mockUser, mockPatientId, createPrescriptionDto);

      expect(response.message).toBe('Prescription created successfully');
      expect(response.data).toEqual([{}]);
      expect(prescriptionService.createPrescription).toHaveBeenCalledWith(
        mockUser,
        mockPatientId,
        createPrescriptionDto,
      );
    });
  });

  describe('updatePrescription', () => {
    it('should update a prescription', async () => {
      const updatePrescriptionDto: UpdatePrescriptionDto = {
        medicine: 'Ibuprofen',
        dosage: '4 Tablets per day',
        instructions: 'Take one tablet before breakfast',
      };

      const result = {
        message: 'Prescription updated successfully',
        data: [{}],
      };

      jest.spyOn(prescriptionService, 'updatePrescription').mockResolvedValue(result);

      const response = await controller.updatePrescription(
        mockUser,
        mockPatientId,
        updatePrescriptionDto,
      );

      expect(response.message).toBe('Prescription updated successfully');
      expect(response.data).toEqual([{}]);
      expect(prescriptionService.updatePrescription).toHaveBeenCalledWith(
        mockUser,
        mockPatientId,
        updatePrescriptionDto,
      );
    });
  });
});
