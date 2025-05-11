import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitySlotController } from '../controllers/availabilityslot.controller';
import { AvailabilitySlotService } from '../services/availabilityslot.service';
import { SetAvailabilityDto, UpdateAvailabilityDto } from '../dto/availabilityslot.dto';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { JwtService } from '@nestjs/jwt'; // Import JwtService for mocking
import { ConfigService } from '@nestjs/config'; // Import ConfigService for mocking
import { UserService } from '../../user/services/user.service'; // Import UserService for mocking

describe('AvailabilitySlotController', () => {
  let controller: AvailabilitySlotController;
  let service: AvailabilitySlotService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockService = {
    setAvailabilitySlot: jest.fn(),
    getAvailabilitySlots: jest.fn(),
    getAvailabilityslot: jest.fn(),
    updateAvailabilitySlot: jest.fn(),
    deleteAvailabilitySlot: jest.fn(),
  };

  const mockUserService = {
    findUserById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {}; // Mock ConfigService if needed

  const mockUser: User = {
    id: 'user-id',
    email: 'doctor@example.com',
    role: UserRole.DOCTOR,
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilitySlotController],
      providers: [
        {
          provide: AvailabilitySlotService,
          useValue: mockService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // Mock JwtService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService, // Mock ConfigService if needed
        },
        {
          provide: UserService,
          useValue: mockUserService, // Mock UserService
        },
      ],
    }).compile();

    controller = module.get<AvailabilitySlotController>(AvailabilitySlotController);
    service = module.get<AvailabilitySlotService>(AvailabilitySlotService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('setAvailabilitySlot', () => {
    it('should call service and return created slot', async () => {
      const dto: SetAvailabilityDto = {
        startTime: new Date('2025-02-07T09:00:00.000Z'),
        endTime: new Date('2025-02-07T10:00:00.000Z'),
        isAvailable: true,
      };
      const result = { message: 'Created' };

      mockService.setAvailabilitySlot.mockResolvedValue(result);

      const response = await controller.setAvailabilitySlot(mockUser, dto);

      expect(service.setAvailabilitySlot).toHaveBeenCalledWith(mockUser, dto);
      expect(response).toBe(result);
    });
  });

  describe('getAvailabilitySlots', () => {
    it('should return availability slots for the user', async () => {
      const result = [{ id: 'slot1' }, { id: 'slot2' }];

      mockService.getAvailabilitySlots.mockResolvedValue(result);

      const response = await controller.getAvailabilitySlots(mockUser);

      expect(service.getAvailabilitySlots).toHaveBeenCalledWith(mockUser);
      expect(response).toBe(result);
    });
  });

  describe('getAvailabilityslot', () => {
    it('should return a single availability slot by ID', async () => {
      const slotId = 'slot-id';
      const result = { id: slotId };

      mockService.getAvailabilityslot.mockResolvedValue(result);

      const response = await controller.getAvailabilityslot(mockUser, slotId);

      expect(service.getAvailabilityslot).toHaveBeenCalledWith(mockUser, slotId);
      expect(response).toBe(result);
    });
  });

  describe('updateAvailabilitySlot', () => {
    it('should update and return updated availability slot', async () => {
      const slotId = 'slot-id';
      const dto: UpdateAvailabilityDto = {
        startTime: new Date('2025-02-07T09:00:00.000Z'),
        endTime: new Date('2025-02-07T10:00:00.000Z'),
        isAvailable: false,
      };
      const result = { message: 'Updated' };

      mockService.updateAvailabilitySlot.mockResolvedValue(result);

      const response = await controller.updateAvailabilitySlot(mockUser, slotId, dto);

      expect(service.updateAvailabilitySlot).toHaveBeenCalledWith(mockUser, slotId, dto);
      expect(response).toBe(result);
    });
  });

  describe('deleteAvailabilitySlot', () => {
    it('should delete slot and return success message', async () => {
      const slotId = 'slot-id';
      const result = { message: 'Deleted' };

      mockService.deleteAvailabilitySlot.mockResolvedValue(result);

      const response = await controller.deleteAvailabilitySlot(mockUser, slotId);

      expect(service.deleteAvailabilitySlot).toHaveBeenCalledWith(mockUser, slotId);
      expect(response).toBe(result);
    });
  });
});
