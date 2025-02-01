import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { User } from 'src/shared/entities/user.entity';
import { Review } from 'src/shared/entities/review.entity';


@Module({
      imports: [
        TypeOrmModule.forFeature([User, Review]),
      ],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}
