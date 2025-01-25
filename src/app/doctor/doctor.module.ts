import { Module } from '@nestjs/common';
import { DoctorService } from './services/doctor.service';
import { DoctorController } from './controllers/doctor.controller';

@Module({
  providers: [DoctorService],
  controllers: [DoctorController]
})
export class DoctorModule {}
