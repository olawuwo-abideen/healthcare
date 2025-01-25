import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
// import { UserAlreadyExistConstraint } from 'src/shared/validations/user-exists.validation';
import { UserModule } from '../../../app/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  // providers: [UserAlreadyExistConstraint],
})
export class ValidatorModule {}
