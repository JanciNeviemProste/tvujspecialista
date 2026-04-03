import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Magic byte signatures for allowed image types
const IMAGE_SIGNATURES: Array<{ mime: string; bytes: number[] }> = [
  { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
];

function validateImageMagicBytes(buffer: Buffer): boolean {
  for (const sig of IMAGE_SIGNATURES) {
    // Special handling for WebP: RIFF at 0-3, then WEBP at 8-11
    if (sig.mime === 'image/webp') {
      const riffMatch = sig.bytes.every((b, i) => buffer[i] === b);
      const webpMarker = [0x57, 0x45, 0x42, 0x50];
      const webpMatch = webpMarker.every((b, i) => buffer[8 + i] === b);
      if (riffMatch && webpMatch) return true;
    } else {
      if (sig.bytes.every((b, i) => buffer[i] === b)) return true;
    }
  }
  return false;
}

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload profile photo' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Photo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
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

    if (!validateImageMagicBytes(file.buffer)) {
      throw new BadRequestException('File content does not match an allowed image format');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size too large. Maximum 5MB allowed');
    }

    return this.cloudinaryService.updateProfilePhoto(req.user.userId, file);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('event-banner')
  @UseInterceptors(FileInterceptor('banner'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload event banner image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Banner uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  async uploadEventBanner(
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

    if (!validateImageMagicBytes(file.buffer)) {
      throw new BadRequestException('File content does not match an allowed image format');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size too large. Maximum 5MB allowed');
    }

    const bannerUrl = await this.cloudinaryService.uploadEventBanner(file, Date.now().toString());
    return { bannerImage: bannerUrl };
  }
}
