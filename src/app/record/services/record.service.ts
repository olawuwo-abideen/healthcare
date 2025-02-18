  import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from '../../../shared/entities/user.entity';
  import { MedicalRecord } from '../../../shared/entities/medical-record.entity';
  import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from '../dto/medicalrecord.dto';
  import { CloudinaryService } from '../../../shared/cloudinary/services/cloudinary.service';



  @Injectable()
  export class RecordService {

  constructor(
  @InjectRepository(MedicalRecord)
  private readonly medicalRecordRepository: Repository<MedicalRecord>,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async createMedicalRecord(
  uploadedfiles: Express.Multer.File,
  user: User,
  patientId: string,
  data: CreateMedicalRecordDto,
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


  let uploadedFileUrl: string | null = null;
  if (uploadedfiles) {
  const uploadResponse = await this.cloudinaryService.uploadFile(uploadedfiles);
  uploadedFileUrl = uploadResponse.secure_url;
  }


  const medicalRecordData = {
  user: { id: user.id },
  patient: { id: patientId },
  description: data.description,
  fileUrl: uploadedFileUrl, 
  };


  const savedMedicalRecord = await this.medicalRecordRepository.save(medicalRecordData);

  return {
  message: 'Medical Record submitted successfully',
  data: savedMedicalRecord,
  };
  }



  public async getMedicalRecord(
  patientId: string): Promise<{message: string; data:any[]}> {
  const medicalrecords = await this.medicalRecordRepository.find({
  where: { patient: { id: patientId } },
  relations: ['user'],
  });

  if (!medicalrecords|| medicalrecords.length === 0) {
  throw new NotFoundException('No Medical Record found for this patient');
  }

  return {
  message:" Medical Record Retrieved Sucessfully",
  data: medicalrecords.map(medicalrecord => ({
  id: medicalrecord.id,
  userId: medicalrecord.user.id,
  description: medicalrecord.description,
  uploadedfiles: medicalrecord.uploadedfiles,
  patientId: patientId, 
  createdAt: medicalrecord.createdAt,
  updatedAt: medicalrecord.updatedAt,
  })),
  }
  }

  public async updateMedicalRecord(
  uploadedfiles: Express.Multer.File,
  user: User,
  medicalRecordId: string,
  data: UpdateMedicalRecordDto,
  ): Promise<any> {

  const updatedMedicalRecord = await this.medicalRecordRepository.findOne({
  where: { id: medicalRecordId },
  });

  if (!updatedMedicalRecord) {
  throw new NotFoundException('Medical Record not found');
  }

  let uploadedFileUrl: string | null = null;
  if (uploadedfiles) {
  const uploadResponse = await this.cloudinaryService.uploadFile(uploadedfiles);
  uploadedFileUrl = uploadResponse.secure_url;
  updatedMedicalRecord.uploadedfiles = uploadedFileUrl; 
  }


  await this.medicalRecordRepository.update(medicalRecordId, {
  ...data,
  uploadedfiles: uploadedFileUrl ? uploadedFileUrl : updatedMedicalRecord.uploadedfiles,  
  });

  const updatedRecord = await this.medicalRecordRepository.findOne({
  where: { id: medicalRecordId },
  });

  return {
  message: 'Medical Record updated successfully',
  updatedRecord,
  };
  }


  }