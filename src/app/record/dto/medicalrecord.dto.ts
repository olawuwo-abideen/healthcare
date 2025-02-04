import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicalRecordDto {

@ApiProperty({
description: 'Doctor upload medical record for patient',
example: 'X-ray image',
})
@IsString()
@IsNotEmpty()
description: string;
}



export class UpdateMedicalRecordDto {

@ApiProperty({
description: 'Doctor upload medical record for patient',
example: 'X-ray image',
})
@IsString()
@IsNotEmpty()
description: string;
}