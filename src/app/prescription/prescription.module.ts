import { Module } from '@nestjs/common';
import { PrescriptionService } from './services/prescription.service';
import { PrescriptionController } from './controllers/prescription.controller';
import { User } from 'src/shared/entities/user.entity';
import { Prescription } from 'src/shared/entities/prescription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, Prescription]),
          JwtModule.register({}),
          UserModule,
          AuthModule
    ],
  providers: [PrescriptionService],
  controllers: [PrescriptionController]
})
export class PrescriptionModule {}
