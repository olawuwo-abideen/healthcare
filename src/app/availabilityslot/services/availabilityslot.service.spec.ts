import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitySlotService } from './availabilityslot.service';
import { AvailabilitySlot } from '../../../shared/entities/availabilityslot.entity';
import { User } from '../../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SetAvailabilityDto, UpdateAvailabilityDto } from '../dto/availabilityslot.dto';

describe('AvailabilitySlotService', () => {
  let service: AvailabilitySlotService;
  let availabilitySlotRepository: Repository<AvailabilitySlot>;
  let userRepository: Repository<User>;

  const mockUser = { id: 'user-id' } as User;
  const mockAvailabilitySlot = { id: 'slot-id', user: mockUser, startTime: new Date(), endTime: new Date(), isAvailable: true } as AvailabilitySlot;
  const mockSetAvailabilityDto: SetAvailabilityDto = { startTime: new Date(), endTime: new Date(), isAvailable: true };
  const mockUpdateAvailabilityDto: UpdateAvailabilityDto = { startTime: new Date(), endTime: new Date(), isAvailable: false };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilitySlotService,
        {
          provide: getRepositoryToken(AvailabilitySlot),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AvailabilitySlotService>(AvailabilitySlotService);
    availabilitySlotRepository = module.get<Repository<AvailabilitySlot>>(getRepositoryToken(AvailabilitySlot));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('setAvailabilitySlot', () => {
    it('should create and return an availability slot', async () => {
      jest.spyOn(availabilitySlotRepository, 'create').mockReturnValue(mockAvailabilitySlot);
      jest.spyOn(availabilitySlotRepository, 'save').mockResolvedValue(mockAvailabilitySlot);

      const result = await service.setAvailabilitySlot(mockUser, mockSetAvailabilityDto);

      expect(result.message).toBe('Availability slot created successfully');
      expect(result.availability).toEqual(mockAvailabilitySlot);
    });
  });

  describe('getAvailabilitySlots', () => {
    it('should return availability slots for the user', async () => {
      jest.spyOn(availabilitySlotRepository, 'find').mockResolvedValue([mockAvailabilitySlot]);

      const result = await service.getAvailabilitySlots(mockUser);

      expect(result.message).toBe('Availability slots retrieved successfully');
      expect(result.availabilitySlots).toEqual([mockAvailabilitySlot]);
    });

    it('should return a message if no slots are found', async () => {
      jest.spyOn(availabilitySlotRepository, 'find').mockResolvedValue([]);

      const result = await service.getAvailabilitySlots(mockUser);

      expect(result.message).toBe('No availability slots found');
      expect(result.availabilitySlots).toEqual([]);
    });
  });

  describe('getAvailabilityslot', () => {
    it('should return a single availability slot by ID', async () => {
      jest.spyOn(availabilitySlotRepository, 'findOne').mockResolvedValue(mockAvailabilitySlot);

      const result = await service.getAvailabilityslot(mockUser, mockAvailabilitySlot.id);

      expect(result.message).toBe('Availability slot retrieved successfully');
      expect(result.availabilitySlot).toEqual(mockAvailabilitySlot);
    });

    it('should return a message if the slot is not found', async () => {
      jest.spyOn(availabilitySlotRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.getAvailabilityslot(mockUser, 'non-existing-id');

      expect(result.message).toBe('Availability slot not found');
      expect(result.availabilitySlot).toBeUndefined();
    });
  });

  describe('updateAvailabilitySlot', () => {
    it('should update and return the updated availability slot', async () => {
      jest.spyOn(availabilitySlotRepository, 'findOne').mockResolvedValue(mockAvailabilitySlot);
      jest.spyOn(availabilitySlotRepository, 'save').mockResolvedValue(mockAvailabilitySlot);

      const result = await service.updateAvailabilitySlot(mockUser, mockAvailabilitySlot.id, mockUpdateAvailabilityDto);

      expect(result.message).toBe('Availability slot updated successfully');
      expect(result.availabilitySlot).toEqual(mockAvailabilitySlot);
    });

    it('should throw NotFoundException if the availability slot is not found', async () => {
      jest.spyOn(availabilitySlotRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.updateAvailabilitySlot(mockUser, 'non-existing-id', mockUpdateAvailabilityDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('deleteAvailabilitySlot', () => {
    it('should delete the availability slot and return a success message', async () => {
      jest.spyOn(availabilitySlotRepository, 'findOne').mockResolvedValue(mockAvailabilitySlot);
      jest.spyOn(availabilitySlotRepository, 'remove').mockResolvedValue(undefined);

      const result = await service.deleteAvailabilitySlot(mockUser, mockAvailabilitySlot.id);

      expect(result.message).toBe('Availability slot deleted successfully');
    });

    it('should throw NotFoundException if the availability slot is not found', async () => {
      jest.spyOn(availabilitySlotRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.deleteAvailabilitySlot(mockUser, 'non-existing-id'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
