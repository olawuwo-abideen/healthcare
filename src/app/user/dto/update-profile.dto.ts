import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Gender, DoctorSpecilization } from 'src/shared/entities/user.entity';


export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'Age of the user.',
    example: 25,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
  })
   @IsMobilePhone()
  @IsNotEmpty()
  phonenumber: string;

  @ApiProperty({
    description: 'The user gender. allowed values: female and male',
    enum: Gender,
    example: 'male',
  })
 @IsNotEmpty()
 gender: Gender;

}




export class UpdateDoctorProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Age of the user.',
    example: 25,
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
  })
   @IsMobilePhone()
  @IsNotEmpty()
  phonenumber: string;

  @ApiProperty({
    description: 'The user gender. allowed values: female and male',
    enum: Gender,
    example: 'male',
  })
 @IsNotEmpty()
 gender: Gender;


 @ApiProperty({
  description: 'The doctor area of specilization',
  enum: DoctorSpecilization,
  example: 'cardiology',
})
@IsNotEmpty()
specialization: DoctorSpecilization;

@ApiProperty({
  description: 'The doctor years of experience',
  example: '3',
})
@IsNotEmpty()
experienceyears: number;

@ApiProperty({
  description: 'The doctor clinic address',
  example: '10 john doe avenue, ikeja lagos',
})
@IsString()
@IsNotEmpty()
clinicaddress: string;

}