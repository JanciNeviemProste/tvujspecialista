import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { VideosService } from '../services/videos.service';
import { UploadVideoDto } from '../dto/upload-video.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';

interface UploadedVideoFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiTags('Academy - Videos')
@Controller('academy/videos')
export class VideosController {
  constructor(
    private videosService: VideosService,
    private configService: ConfigService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('video'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a video for a lesson',
    description:
      'Admin only. Upload video file with lesson ID and title. Max size: 500MB. Supported formats: mp4, mov, avi, webm',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Video file to upload',
        },
        lessonId: {
          type: 'string',
          format: 'uuid',
          description: 'UUID of the lesson',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        title: {
          type: 'string',
          description: 'Title of the video',
          example: 'Introduction to TypeScript',
        },
      },
      required: ['video', 'lessonId', 'title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Video uploaded successfully and processing started',
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB
          new FileTypeValidator({
            fileType:
              /(video\/mp4|video\/quicktime|video\/x-msvideo|video\/webm)/,
          }),
        ],
      }),
    )
    file: UploadedVideoFile,
    @Body() dto: UploadVideoDto,
  ) {
    return this.videosService.uploadVideo(file, dto.lessonId, dto.title);
  }

  @Get(':id/stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get signed streaming URL for a video',
    description:
      'Returns a signed URL valid for 1 hour. Requires enrollment in the course or the lesson must be marked as free.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns signed streaming URL and video duration',
    schema: {
      type: 'object',
      properties: {
        streamUrl: {
          type: 'string',
          description: 'Signed Cloudinary URL for streaming',
        },
        duration: {
          type: 'number',
          description: 'Video duration in seconds',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Video not ready for streaming' })
  @ApiResponse({
    status: 403,
    description: 'Must be enrolled in course to access this video',
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async getStreamUrl(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.videosService.getStreamUrl(id, req.user.userId);
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Cloudinary webhook endpoint',
    description:
      'Receives notifications from Cloudinary when video processing is complete. Validates webhook signature.',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload or signature' })
  async handleWebhook(
    @Body() payload: Record<string, unknown>,
    @Headers('x-cld-signature') signature: string,
    @Headers('x-cld-timestamp') timestamp: string,
  ) {
    // Verify webhook signature if secret is configured
    const webhookSecret = this.configService.get<string>('CLOUDINARY_WEBHOOK_SECRET');
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload) + timestamp)
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    await this.videosService.handleWebhook(payload);
    return { message: 'Webhook processed successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a video',
    description:
      'Admin only. Deletes video from Cloudinary and database, and updates the associated lesson.',
  })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async deleteVideo(@Param('id') id: string) {
    await this.videosService.deleteVideo(id);
    return { message: 'Video deleted successfully' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get video details',
    description: 'Admin only. Returns video metadata and processing status.',
  })
  @ApiResponse({ status: 200, description: 'Returns video details' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async getVideo(@Param('id') id: string) {
    return this.videosService.findById(id);
  }
}
