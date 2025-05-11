import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from '../controllers/review.controller';
import { ReviewService } from '../services/review.service';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../shared/entities/user.entity';

const mockService = {
  createReview: jest.fn().mockResolvedValue({ success: true }),
  getReviewByDoctorId: jest.fn().mockResolvedValue([{ id: 'rev1', comment: 'Great' }]),
  updateReview: jest.fn().mockResolvedValue({ success: true }),
  deleteReview: jest.fn().mockResolvedValue({ success: true }),
};

class MockAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

jest.mock('../../../shared/decorators/roles.decorator', () => ({
  Roles: () => () => {},
}));

describe('ReviewController', () => {
  let controller: ReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [{ provide: ReviewService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('should create a review', async () => {
    const result = await controller.createReview(
      { id: 'user1', role: UserRole.PATIENT } as any,
      'doctor1',
      { rating: 5, comment: 'Excellent' }
    );
    expect(mockService.createReview).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('should get reviews for a doctor', async () => {
    const result = await controller.getReviewByDoctorId(
      { id: 'user1', role: UserRole.PATIENT } as any,
      'doctor1'
    );
    expect(mockService.getReviewByDoctorId).toHaveBeenCalled();
    expect(result).toEqual([{ id: 'rev1', comment: 'Great' }]);
  });

  it('should update a review', async () => {
    const result = await controller.updateReview(
      { id: 'user1', role: UserRole.PATIENT } as any,
      'review1',
      { rating: 4, comment: 'Updated comment' }
    );
    expect(mockService.updateReview).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('should delete a review', async () => {
    const result = await controller.deleteReview(
      { id: 'user1', role: UserRole.PATIENT } as any,
      'review1'
    );
    expect(mockService.deleteReview).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
