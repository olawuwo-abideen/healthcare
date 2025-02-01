import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Gender, DoctorSpecilization } from 'src/shared/entities/user.entity';


export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Age of the user.',
    example: 25,
  })
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
  })
  @IsNotEmpty()
  phonenumber: string;

  @ApiProperty({
    description: 'The user gender. Allowed values: Female and Male',
    enum: Gender,
    example: 'Male',
  })
 @IsNotEmpty()
 gender: Gender;


 @ApiProperty({
  description: 'The doctor area of specilization',
  enum: DoctorSpecilization,
  example: 'cardiology',
})
// @IsNotEmpty()
specialization: DoctorSpecilization;

@ApiProperty({
  description: 'The doctor years of experience',
  example: '3',
})
// @IsNotEmpty()
experienceyears: number;


}


