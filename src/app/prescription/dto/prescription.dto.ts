import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrescriptionDto {

@ApiProperty({
description: 'A medicine prescribed for a patient',
example: 'Paracetamol',
})
@IsString()
@IsNotEmpty()
medicine: string;

@ApiProperty({
description: 'Dosage for the medicine',
example: '6 Tablet per day',
})
@IsString()
@IsNotEmpty()
dosage: string;

@ApiProperty({
description: 'Instruction on how the drug is to be taken',
example: 'Two tablet after each meal',
})
@IsString()
@IsNotEmpty()
instructions: string;
}



export class UpdatePrescriptionDto {

@ApiProperty({
description: 'A medicine prescribed for a patient',
example: 'Paracetamol',
})
@IsString()
@IsNotEmpty()
medicine: string;

@ApiProperty({
description: 'Dosage for the medicine',
example: '6 Tablet per day',
})
@IsString()
@IsNotEmpty()
dosage: string;

@ApiProperty({
description: 'Instruction on how the drug is to be taken',
example: 'Two tablet after each meal',
})
@IsString()
@IsNotEmpty()
instructions: string;
}
