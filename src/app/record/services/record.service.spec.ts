import { Test, TestingModule } from '@nestjs/testing';
import { RecordService } from './record.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicalRecord } from '../../../shared/entities/medical-record.entity';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { CloudinaryService } from '../../../shared/cloudinary/services/cloudinary.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from '../dto/medicalrecord.dto';

describe('RecordService', () => {
  let service: RecordService;
  let userRepo: Repository<User>;
  let medicalRecordRepo: Repository<MedicalRecord>;
  let cloudinaryService: CloudinaryService;

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockMedicalRecordRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(MedicalRecord), useValue: mockMedicalRecordRepo },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    service = module.get<RecordService>(RecordService);
    userRepo = module.get(getRepositoryToken(User));
    medicalRecordRepo = module.get(getRepositoryToken(MedicalRecord));
    cloudinaryService = module.get(CloudinaryService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createMedicalRecord', () => {
    it('should create a medical record', async () => {
      const doctor = { id: 'doc1' } as User;
      const patient = { id: 'pat1', role: UserRole.PATIENT } as User;
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      const dto: CreateMedicalRecordDto = { description: 'Test' };

      mockUserRepo.findOne.mockResolvedValue(patient);
      mockCloudinaryService.uploadFile.mockResolvedValue({ secure_url: 'http://file.url' });
      mockMedicalRecordRepo.save.mockResolvedValue({ id: 'record1' });

      const result = await service.createMedicalRecord(file, doctor, 'pat1', dto);

      expect(result.message).toEqual('Medical Record submitted successfully');
      expect(mockMedicalRecordRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if patient not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createMedicalRecord(null, {} as User, 'bad-id', { description: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is not a patient', async () => {
      const nonPatient = { id: '1', role: UserRole.DOCTOR } as User;
      mockUserRepo.findOne.mockResolvedValue(nonPatient);

      await expect(
        service.createMedicalRecord(null, {} as User, '1', { description: 'X' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMedicalRecord', () => {
    it('should return medical records for a patient', async () => {
      const patientId = 'pat1';
      const mockData = [
        {
          id: 'rec1',
          user: { id: 'doc1' },
          description: 'Test',
          uploadedfiles: 'file.url',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMedicalRecordRepo.find.mockResolvedValue(mockData);

      const result = await service.getMedicalRecord(patientId);
      expect(result.data).toHaveLength(1);
      expect(result.message).toContain('Retrieved');
    });

    it('should throw NotFoundException if no records found', async () => {
      mockMedicalRecordRepo.find.mockResolvedValue([]);

      await expect(service.getMedicalRecord('no-record')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMedicalRecord', () => {
    it('should update an existing medical record', async () => {
      const recordId = 'rec1';
      const user = { id: 'doc1' } as User;
      const file = { buffer: Buffer.from('file') } as Express.Multer.File;
      const dto: UpdateMedicalRecordDto = { description: 'Updated' };
      const existingRecord = { id: recordId } as MedicalRecord;

      mockMedicalRecordRepo.findOne.mockResolvedValueOnce(existingRecord); // for fetch
      mockCloudinaryService.uploadFile.mockResolvedValue({ secure_url: 'http://updated.url' });
      mockMedicalRecordRepo.update.mockResolvedValue(undefined);
      mockMedicalRecordRepo.findOne.mockResolvedValueOnce({
        ...existingRecord,
        uploadedfiles: 'http://updated.url',
        description: 'Updated',
      });

      const result = await service.updateMedicalRecord(file, user, recordId, dto);

      expect(result.message).toEqual('Medical Record updated successfully');
      expect(result.updatedRecord.description).toEqual('Updated');
    });

    it('should throw NotFoundException if record not found', async () => {
      mockMedicalRecordRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateMedicalRecord(null, {} as User, 'bad-id', { description: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
