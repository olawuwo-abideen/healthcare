import { IsNotEmpty } from 'class-validator';

export class CreateMedicalRecordDto {


  @IsNotEmpty()
  description: string;
}



export class UpdateMedicalRecordDto {


    @IsNotEmpty()
    description: string;
  }