import { Module } from '@nestjs/common';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';

@Module({
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}
