import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/shared/services/typeorm/typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { RecordModule } from './record/record.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { ReviewModule } from './review/review.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      ThrottlerModule.forRoot([
        {
          ttl: 60000,
          limit: 10,
        },
      ]),
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
      }),
    AuthModule,
    UserModule,
    DoctorModule,
    AppointmentModule,
    RecordModule,
    PrescriptionModule,
    ReviewModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
