import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionService } from '../services/prescription.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Prescription } from '../../../shared/entities/prescription.entity';
import { User } from '../../../shared/entities/user.entity';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from '../dto/prescription.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PrescriptionService', () => {
  let service: PrescriptionService;
  let prescriptionRepository: any;
  let userRepository: any;

  const mockUser = { id: 'user-id', role: 'doctor' } as User;
  const mockPatient = { id: 'patient-id', role: 'patient' } as User;
  const mockPrescription = {
    id: 'prescription-id',
    user: mockUser,
    patient: mockPatient,
    medicine: 'Paracetamol',
    dosage: '2 Tablets',
    instructions: 'Take twice a day',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Prescription;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionService,
        {
          provide: getRepositoryToken(Prescription),
          useValue: {
            save: jest.fn().mockResolvedValue(mockPrescription),
            find: jest.fn().mockResolvedValue([mockPrescription]),
            findOne: jest.fn().mockResolvedValue(mockPrescription),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockPatient),
          },
        },
      ],
    }).compile();

    service = module.get<PrescriptionService>(PrescriptionService);
    prescriptionRepository = module.get(getRepositoryToken(Prescription));
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('createPrescription', () => {
    it('should create a new prescription successfully', async () => {
      const createPrescriptionDto: CreatePrescriptionDto = {
        medicine: 'Paracetamol',
        dosage: '2 Tablets',
        instructions: 'Take twice a day',
      };

      const result = await service.createPrescription(mockUser, 'patient-id', createPrescriptionDto);

      expect(result.message).toBe('Prescription submitted successfully');
      expect(result.data.prescriptionId).toBeDefined();
      expect(prescriptionRepository.save).toHaveBeenCalledWith({
        user: { id: mockUser.id },
        patient: { id: 'patient-id' },
        medicine: createPrescriptionDto.medicine,
        dosage: createPrescriptionDto.dosage,
        instructions: createPrescriptionDto.instructions,
      });
    });

    it('should throw NotFoundException if patient is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const createPrescriptionDto: CreatePrescriptionDto = {
        medicine: 'Paracetamol',
        dosage: '2 Tablets',
        instructions: 'Take twice a day',
      };

      await expect(
        service.createPrescription(mockUser, 'invalid-patient-id', createPrescriptionDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException if user is not a patient', async () => {
      const nonPatient = { id: 'non-patient-id', role: 'doctor' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(nonPatient);

      const createPrescriptionDto: CreatePrescriptionDto = {
        medicine: 'Paracetamol',
        dosage: '2 Tablets',
        instructions: 'Take twice a day',
      };

      await expect(
        service.createPrescription(mockUser, 'non-patient-id', createPrescriptionDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getPrescription', () => {
    it('should retrieve prescriptions successfully', async () => {
      const result = await service.getPrescription(mockUser, 'patient-id');

      expect(result.message).toBe('Prescriptions Retrieved Sucessfully');
      expect(result.data.length).toBe(1);
      expect(result.data[0].medicine).toBe(mockPrescription.medicine);
    });

    it('should throw NotFoundException if no prescriptions found', async () => {
      jest.spyOn(prescriptionRepository, 'find').mockResolvedValueOnce([]);

      await expect(service.getPrescription(mockUser, 'patient-id')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('updatePrescription', () => {
    it('should update prescription successfully', async () => {
      const updatePrescriptionDto: UpdatePrescriptionDto = {
        medicine: 'Ibuprofen',
        dosage: '1 Tablet',
        instructions: 'Take once a day',
      };

      const updatedPrescription = {
        ...mockPrescription,
        medicine: updatePrescriptionDto.medicine,
        dosage: updatePrescriptionDto.dosage,
        instructions: updatePrescriptionDto.instructions,
      };

      jest.spyOn(prescriptionRepository, 'findOne').mockResolvedValueOnce(mockPrescription);
      jest.spyOn(prescriptionRepository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(prescriptionRepository, 'findOne').mockResolvedValueOnce(updatedPrescription);

      const result = await service.updatePrescription(
        mockUser,
        'prescription-id',
        updatePrescriptionDto,
      );

      expect(result.message).toBe('Prescription updated successfully');
      expect(result.updatedprescription.medicine).toBe(updatePrescriptionDto.medicine);
      expect(result.updatedprescription.dosage).toBe(updatePrescriptionDto.dosage);
      expect(result.updatedprescription.instructions).toBe(updatePrescriptionDto.instructions);
    });

    it('should throw NotFoundException if prescription is not found', async () => {
      jest.spyOn(prescriptionRepository, 'findOne').mockResolvedValueOnce(null);

      const updatePrescriptionDto: UpdatePrescriptionDto = {
        medicine: 'Ibuprofen',
        dosage: '1 Tablet',
        instructions: 'Take once a day',
      };

      await expect(
        service.updatePrescription(mockUser, 'invalid-prescription-id', updatePrescriptionDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
