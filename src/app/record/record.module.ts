import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordService } from './services/record.service';
import { RecordController } from './controllers/record.controller';
import { User } from 'src/shared/entities/user.entity';
import { MedicalRecord } from 'src/shared/entities/medical-record.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
      imports: [
        TypeOrmModule.forFeature([User, MedicalRecord]),
        CloudinaryModule
      ],
  providers: [RecordService],
  controllers: [RecordController]
})
export class RecordModule {}
