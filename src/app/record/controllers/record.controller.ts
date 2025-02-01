import { Body, Controller, Get, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/shared/entities/user.entity';
import { RecordService } from '../services/record.service';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from '../dto/medicalrecord.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Medical-Records')
@Controller('medical-records')
export class RecordController {

constructor(
private readonly recordService:RecordService
){}

@Post('patient/:id')
  @ApiOperation({ summary: 'Create a Medical Records for a patient' })
  @ApiBody({ type: CreateMedicalRecordDto, 
    description: 'Create a Medical Records for a patient' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Medical Records created successfully.',
  })
@UseInterceptors(FileInterceptor('uploadedfile'))
public async createMedicalRecord(
@UploadedFile() uploadedfiles: Express.Multer.File,
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) patientId: string,
@Body() data: CreateMedicalRecordDto,
) {
return await this.recordService.createMedicalRecord(uploadedfiles, user, patientId, data);
}

@Get('patient/:id')
  @ApiOperation({ summary: 'Get a Medical Records of a patient' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Medical Records retrieved successfully' })
  public async getMedicalRecord(
    @Param('id', IsValidUUIDPipe) patientId: string) {
    return this.recordService.getMedicalRecord(patientId);
  }

  @Put('patient/:id')
  @ApiOperation({ summary: 'Update a Medical Records' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Medical Records updated successfully' })
  public async updateMedicalRecord(
    @UploadedFile() uploadedfiles: Express.Multer.File,
    @CurrentUser() user: User,
    @Param('id', IsValidUUIDPipe) medicalrecordId: string,
    @Body() data: UpdateMedicalRecordDto,
  ) {
    return this.recordService.updateMedicalRecord(uploadedfiles, user, medicalrecordId, data);
  }



}