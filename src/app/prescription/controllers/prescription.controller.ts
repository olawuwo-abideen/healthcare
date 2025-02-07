  import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
  import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
  import { User, UserRole } from 'src/shared/entities/user.entity';
  import { PrescriptionService } from '../services/prescription.service';
  import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
  import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { CreatePrescriptionDto, UpdatePrescriptionDto } from '../dto/prescription.dto';
  import { AuthGuard } from 'src/app/auth/guards/auth.guard';
  import { Roles } from 'src/shared/decorators/roles.decorator';

  @ApiTags('Prescription')
  @Controller('prescription')
  export class PrescriptionController {

  constructor(
  private readonly prescriptionService:PrescriptionService
  ){}

  @Post('patient/:id')
  @ApiOperation({ summary: 'Create a prescription for a patient' })
  @ApiBody({ type: CreatePrescriptionDto, 
  description: 'Create a prescription data' })
  @ApiResponse({
  status: HttpStatus.CREATED,
  description:
  'Prescription created successfully.',
  })
  @ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Patient not found.',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR)
  public async createPrescription(
  @CurrentUser() user: User,
  @Param('id', IsValidUUIDPipe) patientId: string,
  @Body() data: CreatePrescriptionDto,
  ) {
  return await this.prescriptionService.createPrescription(user, patientId, data);
  }

  @Get('patient/:id')
  @ApiOperation({ summary: 'Get a prescription for a patient' })
  @ApiResponse({ 
  status: HttpStatus.OK, 
  description: 'Prescription retrieved successfully' })
  @ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Patient not found.',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR, UserRole.PATIENT)
  public async getPrescription(
  @CurrentUser() user: User,
  @Param('id', IsValidUUIDPipe) patientId: string) {
  return this.prescriptionService.getPrescription(user, patientId);
  }

  @Put('patient/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update a prescription' })
  @ApiBody({ type: UpdatePrescriptionDto, 
  description: 'Create a prescription data' })
  @ApiResponse({ 
  status: HttpStatus.OK, 
  description: 'Prescription updated successfully' })
  @ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Prescription not found.',
  })
  public async updatePrescription(
  @CurrentUser() user: User,
  @Param('id', IsValidUUIDPipe) prescriptionId: string,
  @Body() data: UpdatePrescriptionDto,
  ) {
  return this.prescriptionService.updatePrescription(user, prescriptionId, data);
  }



  }