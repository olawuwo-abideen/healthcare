import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePrescriptionDto {

  @IsNotEmpty()
  medicine: string;

  @IsNotEmpty()
  dosage: string;

  @IsNotEmpty()
  instructions: string;
}



export class UpdatePrescriptionDto {

    @IsNotEmpty()
    medicine: string;
  
    @IsNotEmpty()
    dosage: string;
  
    @IsNotEmpty()
    instructions: string;
  }
  