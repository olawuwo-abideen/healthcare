import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {  UpdateProfileDto } from '../dto/update-profile.dto';
import { CloudinaryService } from 'src/shared/cloudinary/services/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    return await this.userRepository.findOne({ where });
  }


  public async create(data: DeepPartial<User>): Promise<User> {
    const user: User = await this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  public async update(
    where: FindOptionsWhere<User>,
    data: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(where, data);
  }

  public async exists(where: FindOptionsWhere<User>): Promise<boolean> {
    const user: boolean = await this.userRepository.existsBy(where);

    return user;
  }

  public async profile(user: User) {
    return {
      ...user,
    };
  }

  public async changePassword(
    data: ChangePasswordDto,
    user: User,
  ): Promise<{message:string}> {

    if (!user.password) {
      const foundUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
    
      if (!foundUser || !foundUser.password) {
        throw new BadRequestException('No password found for the user.');
      }
    
      user = foundUser; 
    }
  
    const isCurrentPasswordValid = await bcryptjs.compare(
      data.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException(
        'The password you entered does not match your current password.',
      );
    }
  
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match.',
      );
    }
  
    const saltRounds = 10;
    const hashedNewPassword = await bcryptjs.hash(data.password, saltRounds);
  
    await this.update(
      { id: user.id },
      { password: hashedNewPassword },
    );
  
    return {message:"Password updated successfully"};
  }
  
  
  public async updateProfile(
    data: UpdateProfileDto,
    user: User,
  ): Promise<{ message: string; user: User }> {
    const dataToUpdate: Partial<User> = {
      firstname: data.firstname,
      lastname: data.lastname,
      age: data.age,
      phonenumber: data.phonenumber,
      gender: data.gender,
    };
  
    if (user.role === UserRole.DOCTOR) {
      Object.assign(dataToUpdate, {
        specialization: data.specialization,
        experienceYears: data.experienceyears,
      });
    }
  
    Object.assign(user, dataToUpdate);
  
    await this.userRepository.save(user);
  
    return {
      message: 'Profile updated successfully',
      user,
    };
  }
  
  
  public async updateUserImage(
    userimage: Express.Multer.File,
    user: User,
  ): Promise<User> {
    if (userimage) {
      const uploadHeaderImage = await this.cloudinaryService.uploadFile(userimage);
      user.userimage= uploadHeaderImage.secure_url;
    }

    await this.userRepository.save(user);
  
    return user;
  }
  

}
