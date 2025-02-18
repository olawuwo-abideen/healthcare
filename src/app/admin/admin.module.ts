import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import {User} from '../../shared/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
imports: [
TypeOrmModule.forFeature([User]),
JwtModule.register({}),
UserModule,
AuthModule
],
controllers: [AdminController],
providers: [AdminService],
})
export class AdminModule {}