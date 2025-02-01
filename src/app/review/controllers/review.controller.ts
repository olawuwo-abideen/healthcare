import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/shared/entities/user.entity';
import { ReviewService } from '../services/review.service';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Review')
@Controller('review')
export class ReviewController {

constructor(
private readonly reviewService:ReviewService
){}

@Post('doctor/:id')
  @ApiOperation({ summary: 'Create a review for a doctor' })
  @ApiBody({ type: CreateReviewDto, 
    description: 'Create a review for a doctor' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Review created successfully.',
  })
public async createReview(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) doctorId: string,
@Body() data: CreateReviewDto,
) {
return await this.reviewService.createReview(user, doctorId, data);
}

@Get('doctor/:id')
  @ApiOperation({ summary: 'Get reviews for a doctor' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Reviews retrieved successfully' })
  public async getReviewByDoctorId(
    @Param('id', IsValidUUIDPipe) doctorId: string) {
    return this.reviewService.getReviewByDoctorId(doctorId);
  }

  @Put('doctor/:id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Review updated successfully' })
  public async updateReview(
    @CurrentUser() user: User,
    @Param('id', IsValidUUIDPipe) reviewId: string,
    @Body() data: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(user, reviewId, data);
  }

  @Delete('doctor/:id')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Review deleted successfully' })
  public async deleteReview(
    @CurrentUser() user: User, 
    @Param('id', IsValidUUIDPipe) reviewId: string) {
    return this.reviewService.deleteReview(user, reviewId);
  }

}