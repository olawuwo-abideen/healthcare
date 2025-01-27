import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  comment: string;
}


export class UpdateReviewDto {

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
  
    @IsNotEmpty()
    comment: string;
  }