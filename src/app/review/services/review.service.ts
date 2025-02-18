  import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from '../../../shared/entities/user.entity';
  import { Review } from '../../../shared/entities/review.entity';
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

  if (doctor.role !== 'doctor') {
  throw new BadRequestException('The specified user is not a doctor');
  }

  const reviewData = this.reviewRepository.create({
  user: { id: user.id },
  doctor: { id: doctorId },
  rating: data.rating,
  comment: data.comment,
  });

  const savedReview = await this.reviewRepository.save(reviewData);

  return {
  message: 'Review submitted successfully',
  data: {
  reviewId: savedReview.id,
  userId: savedReview.user.id, 
  rating: savedReview.rating,
  comment: savedReview.comment,
  doctorId: doctorId,
  }
  };
  }


  public async getReviewByDoctorId(
  user: User,
  doctorId: string
  ): Promise<{  message: string; data: any[] }> {

  const reviews = await this.reviewRepository.find({
  where: { doctor: { id: doctorId } },
  relations: ['user'], 
  });

  if (!reviews || reviews.length === 0) {
  throw new NotFoundException('No reviews found for this doctor');
  }
  return {
  message: 'Reviews retrieved successfully',
  data: reviews.map(review => ({
  id: review.id,
  userId: review.user.id,
  rating: review.rating,
  comment: review.comment,
  doctorId: doctorId, 
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
  })),
  };
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
  review
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