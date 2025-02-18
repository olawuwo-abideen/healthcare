import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordService } from './services/record.service';
import { RecordController } from './controllers/record.controller';
import { User } from '../../shared/entities/user.entity';
import { MedicalRecord } from '../../shared/entities/medical-record.entity';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
      imports: [
        TypeOrmModule.forFeature([User, MedicalRecord]),
        CloudinaryModule,
            JwtModule.register({}),
            UserModule,
            AuthModule
      ],
  providers: [RecordService],
  controllers: [RecordController]
})
export class RecordModule {}
