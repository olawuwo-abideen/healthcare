import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { User } from '../../shared/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt'; 

@Module({
imports: [
TypeOrmModule.forFeature([User]),
CloudinaryModule,
forwardRef(() => AuthModule),
JwtModule,
],
controllers: [UserController],
providers: [UserService],
exports: [UserService],
})
export class UserModule {}
