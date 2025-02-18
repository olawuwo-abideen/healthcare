  import { Body, Controller, Get, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
  import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
  import { User,UserRole } from '../../../shared/entities/user.entity';
  import { RecordService } from '../services/record.service';
  import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
  import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from '../dto/medicalrecord.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AuthGuard } from '../../../app/auth/guards/auth.guard';
  import { Roles } from '../../../shared/decorators/roles.decorator';

  @ApiBearerAuth()
  @ApiTags('Medical Records')
  @Controller('medical-records')
  export class RecordController {

  constructor(
  private readonly recordService:RecordService
  ){}

  @Post('patient/:id')
  @ApiOperation({ summary: 'Create a medical records for a patient' })
  @ApiBody({ type: CreateMedicalRecordDto, 
  description: 'Create a medical records data' })
  @ApiResponse({
  status: HttpStatus.CREATED,
  description:
  'Medical records created successfully.',
  })
  @ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Patient not found.',
  })
  @UseInterceptors(FileInterceptor('uploadedfile'))
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR)
  public async createMedicalRecord(
  @UploadedFile() uploadedfiles: Express.Multer.File,
  @CurrentUser() user: User,
  @Param('id', IsValidUUIDPipe) patientId: string,
  @Body() data: CreateMedicalRecordDto,
  ) {
  return await this.recordService.createMedicalRecord(uploadedfiles, user, patientId, data);
  }

  @Get('patient/:id')
  @ApiOperation({ summary: 'Get a medical records of a patient' })
  @ApiResponse({ 
  status: HttpStatus.OK, 
  description: 'medical records retrieved successfully' })
  @ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Medical records not found.',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR, UserRole.PATIENT)
  public async getMedicalRecord(
  @Param('id', IsValidUUIDPipe) patientId: string) {
  return this.recordService.getMedicalRecord(patientId);
  }

  @Put('patient/:id')
  @ApiOperation({ summary: 'Update a medical records' })
  @ApiBody({ type: UpdateMedicalRecordDto, 
  description: 'Update a medical records data' })
  @ApiResponse({ 
  status: HttpStatus.OK, 
  description: 'Medical records updated successfully' })
  @ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Patient records not found.',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR)
  public async updateMedicalRecord(
  @UploadedFile() uploadedfiles: Express.Multer.File,
  @CurrentUser() user: User,
  @Param('id', IsValidUUIDPipe) medicalrecordId: string,
  @Body() data: UpdateMedicalRecordDto,
  ) {
  return this.recordService.updateMedicalRecord(uploadedfiles, user, medicalrecordId, data);
  }



  }