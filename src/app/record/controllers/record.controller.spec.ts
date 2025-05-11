import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from './record.controller';
import { RecordService } from '../services/record.service';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
// import { RolesGuard } from '../../../shared/guards/roles.guard'; // If separated
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from '../dto/medicalrecord.dto';
import { User, UserRole } from '../../../shared/entities/user.entity';

describe('RecordController', () => {
  let controller: RecordController;
  let service: RecordService;

  const mockUser: User = {
    id: 'doctor-id',
    email: 'doctor@example.com',
    phonenumber: '1234567890',
    password: '',
    role: UserRole.DOCTOR,
    medicalrecords: [],
    availabilitySlots: [],
    reviews: [],
    prescriptions: [],
    appointments: [],
    resetToken: null,
    toJSON: () => ({}),
  } as User;

  const mockRecordService = {
    createMedicalRecord: jest.fn(),
    getMedicalRecord: jest.fn(),
    updateMedicalRecord: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
      providers: [
        {
          provide: RecordService,
          useValue: mockRecordService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RecordController>(RecordController);
    service = module.get<RecordService>(RecordService);
  });

  describe('createMedicalRecord', () => {
    it('should create a medical record', async () => {
      const dto: CreateMedicalRecordDto = { description: 'X-ray' };
      const uploadedFile = { originalname: 'xray.jpg' } as Express.Multer.File;
      const patientId = 'patient-id';

      const result = { id: 'record-id', ...dto };
      mockRecordService.createMedicalRecord.mockResolvedValue(result);

      const response = await controller.createMedicalRecord(uploadedFile, mockUser, patientId, dto);

      expect(response).toEqual(result);
      expect(service.createMedicalRecord).toHaveBeenCalledWith(uploadedFile, mockUser, patientId, dto);
    });
  });

  describe('getMedicalRecord', () => {
    it('should retrieve a medical record', async () => {
      const patientId = 'patient-id';
      const mockResult = [{ id: 'record-id', description: 'X-ray' }];

      mockRecordService.getMedicalRecord.mockResolvedValue(mockResult);

      const response = await controller.getMedicalRecord(patientId);

      expect(response).toEqual(mockResult);
      expect(service.getMedicalRecord).toHaveBeenCalledWith(patientId);
    });
  });

  describe('updateMedicalRecord', () => {
    it('should update a medical record', async () => {
      const dto: UpdateMedicalRecordDto = { description: 'Updated X-ray' };
      const uploadedFile = { originalname: 'updated-xray.jpg' } as Express.Multer.File;
      const recordId = 'record-id';

      const mockResponse = { id: recordId, ...dto };
      mockRecordService.updateMedicalRecord.mockResolvedValue(mockResponse);

      const response = await controller.updateMedicalRecord(uploadedFile, mockUser, recordId, dto);

      expect(response).toEqual(mockResponse);
      expect(service.updateMedicalRecord).toHaveBeenCalledWith(uploadedFile, mockUser, recordId, dto);
    });
  });
});
