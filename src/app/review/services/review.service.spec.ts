import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from '../services/review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { Review } from '../../../shared/entities/review.entity';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

const mockUserRepo = {
  findOne: jest.fn(),
};

const mockReviewRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Review), useValue: mockReviewRepo },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);

    jest.clearAllMocks();
  });

  const user = { id: 'user1', role: 'patient' } as User;
  const doctor = { id: 'doc1', role: 'doctor' } as User;

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      mockUserRepo.findOne.mockResolvedValue(doctor);
      const mockReview = { id: 'rev1', user: { id: 'user1' }, rating: 5, comment: 'Great' };
      mockReviewRepo.create.mockReturnValue(mockReview);
      mockReviewRepo.save.mockResolvedValue(mockReview);

      const result = await service.createReview(user, 'doc1', { rating: 5, comment: 'Great' });
      expect(result.message).toBe('Review submitted successfully');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 'doc1' } });
    });

    it('should throw NotFoundException if doctor not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(
        service.createReview(user, 'invalidDoc', { rating: 5, comment: 'Great' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is not a doctor', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 'doc2', role: 'patient' });
      await expect(
        service.createReview(user, 'doc2', { rating: 5, comment: 'Nice' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getReviewByDoctorId', () => {
    it('should return reviews for a doctor', async () => {
      const reviews = [
        { id: 'r1', user: { id: 'user1' }, rating: 4, comment: 'Good', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockReviewRepo.find.mockResolvedValue(reviews);
      const result = await service.getReviewByDoctorId(user, 'doc1');
      expect(result.message).toBe('Reviews retrieved successfully');
      expect(result.data.length).toBe(1);
    });

    it('should throw NotFoundException if no reviews found', async () => {
      mockReviewRepo.find.mockResolvedValue([]);
      await expect(service.getReviewByDoctorId(user, 'doc1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateReview', () => {
    it('should update the review', async () => {
      const review = { id: 'r1', userId: 'user1' };
      mockReviewRepo.findOne.mockResolvedValue(review);

      const result = await service.updateReview(user, 'r1', { comment: 'Updated', rating: 4 });
      expect(result.message).toBe('Review updated successfully');
      expect(mockReviewRepo.update).toHaveBeenCalledWith('r1', { comment: 'Updated', rating: 4 });
    });

    it('should throw NotFoundException if review not found', async () => {
      mockReviewRepo.findOne.mockResolvedValue(null);
      await expect(service.updateReview(user, 'badId', { rating: 4, comment: 'Edit' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the review', async () => {
      mockReviewRepo.findOne.mockResolvedValue({ id: 'r1', userId: 'anotherUser' });
      await expect(service.updateReview(user, 'r1', { rating: 3, comment: 'Denied' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteReview', () => {
    it('should delete the review', async () => {
      mockReviewRepo.findOne.mockResolvedValue({ id: 'r1', userId: 'user1' });
      const result = await service.deleteReview(user, 'r1');
      expect(result.message).toBe('Review deleted successfully');
      expect(mockReviewRepo.delete).toHaveBeenCalledWith('r1');
    });

    it('should throw NotFoundException if review not found', async () => {
      mockReviewRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteReview(user, 'badId')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the review', async () => {
      mockReviewRepo.findOne.mockResolvedValue({ id: 'r1', userId: 'otherUser' });
      await expect(service.deleteReview(user, 'r1')).rejects.toThrow(ForbiddenException);
    });
  });
});
