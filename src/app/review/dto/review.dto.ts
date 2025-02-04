import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {

@ApiProperty({
description: 'Patient give doctor a review',
example: '5',
})
@IsNotEmpty()
@IsInt()
@Min(1)
@Max(5)
rating: number;

@ApiProperty({
description: 'Patient comment about a doctor',
example: 'Dr. Trump consistently demonstrates exceptional clinical judgment and a deep commitment to patient care, always going the extra mile to ensure thorough evaluation and optimal treatment plans; a true asset to our team.',
})
@IsString()
@IsNotEmpty()
comment: string;
}


export class UpdateReviewDto {

@ApiProperty({
description: 'Patient give doctor a review',
example: '5',
})
@IsNotEmpty()
@IsInt()
@Min(1)
@Max(5)
rating: number;


@ApiProperty({
description: 'Patient comment about a doctor',
example: 'Dr. Trump consistently demonstrates exceptional clinical judgment and a deep commitment to patient care, always going the extra mile to ensure thorough evaluation and optimal treatment plans; a true asset to our team.',
})
@IsString()
@IsNotEmpty()
comment: string;
}