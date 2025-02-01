import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Review } from 'src/shared/entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createReview(
    user: User,
    doctorId: string,
    data: CreateReviewDto,
  ): Promise<any> {

    const doctor: User | null = await this.userRepository.findOne({
      where: { id: doctorId },
    });
  
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const reviewData = {
      userId: user.id,
      doctorId: doctorId,
      rating: data.rating,
      comment: data.comment,
    };
  

  const savedReview = await this.reviewRepository.save(reviewData);
  
    return {
      message: 'Review submitted successfully',
      data: savedReview
    };
  }
  
  

  public async getReviewByDoctorId(
    
    doctorId: string): Promise<{message: string; data:Review[]}> {
    const reviews = await this.reviewRepository.find({
      where: { id:doctorId },
      relations: ['user'],
    });

    if (!reviews.length) {
      throw new NotFoundException('No reviews found for this doctor');
    }

    return {
      message:"Review Retrieved Sucessfully",
      data:reviews};
  }

  public async updateReview(user: User, reviewId: string, data: UpdateReviewDto): Promise<any> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only update your own review');
    }

    await this.reviewRepository.update(reviewId, data);

    return {
      message: 'Review updated successfully',
    };
  }

  public async deleteReview(user: User, reviewId: string): Promise<any> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own review');
    }

    await this.reviewRepository.delete(reviewId);

    return {
      message: 'Review deleted successfully',
    };
  }
























}