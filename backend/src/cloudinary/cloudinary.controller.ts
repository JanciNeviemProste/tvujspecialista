import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: UploadedFile,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed',
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size too large. Maximum 5MB allowed');
    }

    return this.cloudinaryService.updateProfilePhoto(req.user.userId, file);
  }
}
