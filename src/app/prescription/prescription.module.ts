import { Module } from '@nestjs/common';
import { PrescriptionService } from './services/prescription.service';
import { PrescriptionController } from './controllers/prescription.controller';

@Module({
  providers: [PrescriptionService],
  controllers: [PrescriptionController]
})
export class PrescriptionModule {}
