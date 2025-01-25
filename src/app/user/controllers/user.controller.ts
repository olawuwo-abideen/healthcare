import {
    Controller,
    Get,
    Request,
    Body,
    Post,
    Put,
    UseInterceptors,
    UploadedFile,
    Param,
    HttpStatus
  } from '@nestjs/common';
  import RequestWithUser from 'src/shared/dtos/request-with-user.dto';
  import { UserService } from '../services/user.service';
  import { User } from 'src/shared/entities/user.entity';
  import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
  import { ChangePasswordDto } from '../dto/change-password.dto';
  import { UpdateProfileDto } from '../dto/update-profile.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
  import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  
  @ApiTags('user')
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get('')
      @ApiOperation({ summary: 'Get current user profile' })
      @ApiResponse({ 
        status: HttpStatus.OK,
        description:
          'User profile retrieve successfully.',
      })
    async getProfile(@Request() req: RequestWithUser) {
      return await this.userService.profile(req.user);
    }
  
    @Post('change-password')
      @ApiOperation({ summary: 'User change password' })
      @ApiBody({ type: ChangePasswordDto, description: 'Change user password' })
      @ApiResponse({
        status: HttpStatus.OK,
        description:
          'User Password updated successfully',
      })
    public async changePassword(
      @Body() payload: ChangePasswordDto,
      @CurrentUser() user: User,
    ) {
      return await this.userService.changePassword(payload, user);
    }
  
    @Put('')
      @ApiOperation({ summary: 'Update user profile' })
      @ApiBody({ type: UpdateProfileDto, description: 'Update user profile' })
      @ApiResponse({
        status: HttpStatus.OK,
        description:
          'User profile updated successfully',
      })
    public async updateProfile(
      @Body() payload: UpdateProfileDto,
      @CurrentUser() user: User,
    ) {
      return await this.userService.updateProfile(payload, user);
    }
  
  
  
    @Put('profile-image')
      @ApiOperation({ summary: 'User Update profile image ' })
      @ApiBody({description: 'User update profile image' })
      @ApiResponse({
        status: HttpStatus.OK,
        description:
          'Image update successfully.',
      })
    @UseInterceptors(FileInterceptor('profileimage'))
    public async updateProfileImage(
      @UploadedFile() profileimage: Express.Multer.File,
      @CurrentUser() user: User,
    ) {
      return await this.userService.updateProfileImage(profileimage, user);
    }
  
  
  
  }
  