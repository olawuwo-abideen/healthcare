import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../shared/entities/user.entity';
import { Prescription } from '../../../shared/entities/prescription.entity';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from '../dto/prescription.dto';


@Injectable()
export class PrescriptionService {

constructor(
@InjectRepository(Prescription)
private readonly prescriptionRepository: Repository<Prescription>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
) {}

public async createPrescription(
user: User,
patientId: string,
data: CreatePrescriptionDto,
): Promise<any> {

const patient: User | null = await this.userRepository.findOne({
where: { id: patientId },
});

if (!patient) {
throw new NotFoundException('Patient not found');
}

if (patient.role !== 'patient') {
throw new BadRequestException('The specified user is not a patient');
}

const prescriptionData = {
user: { id: user.id },
patient: { id: patientId },
medicine: data.medicine,
dosage: data.dosage,
instructions: data.instructions
};


const savedPrescription = await this.prescriptionRepository.save(prescriptionData);

return {
message: 'Prescription submitted successfully',
data:  {
  prescriptionId: savedPrescription.id,
  userId: savedPrescription.user.id, 
  medicine: savedPrescription.medicine,
  dosage: savedPrescription.dosage,
  instructions: savedPrescription.instructions,
  patientId: patientId,
}
};
}



public async getPrescription(
  user:User,
patientId: string): Promise<{message: string; data:any[]}> {
const prescriptions = await this.prescriptionRepository.find({
  where: { patient: { id: patientId } },
relations: ['user'],
});

if (!prescriptions|| prescriptions.length === 0) {
throw new NotFoundException('No prescriptions found for this patient');
}

return {
message:"Prescriptions Retrieved Sucessfully",

data: prescriptions.map(prescription => ({
  id: prescription.id,
  userId: prescription.user.id,
  medicine: prescription.medicine,
  dosage: prescription.dosage,
  instructions: prescription.instructions,
  patientId: patientId, 
  createdAt: prescription.createdAt,
  updatedAt: prescription.updatedAt,
})),

};
}

public async updatePrescription(user: User, prescriptionId: string, data: UpdatePrescriptionDto): Promise<any> {
const updatedprescription = await this.prescriptionRepository.findOne({
where: { id: prescriptionId },
});

if (!updatedprescription) {
throw new NotFoundException('Review not found');
}

await this.prescriptionRepository.update(prescriptionId, data);

return {
message: 'Prescription updated successfully',
updatedprescription
};
}


}