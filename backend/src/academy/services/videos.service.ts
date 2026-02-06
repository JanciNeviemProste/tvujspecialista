import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, VideoStatus } from '../../database/entities/video.entity';
import { Lesson } from '../../database/entities/lesson.entity';
import { Enrollment } from '../../database/entities/enrollment.entity';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

interface UploadedVideoFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  // Allowed video MIME types
  private readonly ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ];

  // Maximum file size: 500MB
  private readonly MAX_FILE_SIZE = 500 * 1024 * 1024;

  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadVideo(
    file: UploadedVideoFile,
    lessonId: string,
    title: string,
  ): Promise<Video> {
    // 1. Validate lesson exists
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['module', 'module.course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // 2. Validate file type
    if (!this.ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.ALLOWED_VIDEO_TYPES.join(', ')}`,
      );
    }

    // 3. Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of 500MB`,
      );
    }

    // 4. Create Video record with status: UPLOADING
    const video = this.videoRepository.create({
      lessonId,
      title,
      status: VideoStatus.UPLOADING,
      cloudinaryPublicId: '',
      cloudinaryUrl: '',
      duration: 0,
      thumbnailUrl: '',
      fileSize: file.size.toString(),
      uploadedAt: new Date(),
    });

    const savedVideo = await this.videoRepository.save(video);

    try {
      // 5. Upload to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadVideo(
        file,
        lessonId,
        title,
      );

      // 6. Update Video record with Cloudinary data, status: PROCESSING
      savedVideo.cloudinaryPublicId = uploadResult.publicId;
      savedVideo.cloudinaryUrl = uploadResult.url;
      savedVideo.duration = uploadResult.duration;
      savedVideo.thumbnailUrl = uploadResult.thumbnailUrl;
      savedVideo.status = VideoStatus.PROCESSING;

      await this.videoRepository.save(savedVideo);

      // 7. Update Lesson with videoId and duration (convert seconds to minutes)
      lesson.videoId = savedVideo.id;
      lesson.duration = Math.ceil(uploadResult.duration / 60);
      await this.lessonRepository.save(lesson);

      return savedVideo;
    } catch (error) {
      // If upload fails, update video status to ERROR
      savedVideo.status = VideoStatus.ERROR;
      await this.videoRepository.save(savedVideo);
      throw new BadRequestException(
        `Video upload failed: ${error instanceof Error ? error.message : 'Upload failed'}`,
      );
    }
  }

  async getStreamUrl(
    videoId: string,
    userId: string,
  ): Promise<{ streamUrl: string; duration: number }> {
    // 1. Find video with lesson, module, course relations
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['lesson', 'lesson.module', 'lesson.module.course'],
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // 2. Validate video exists and status = READY
    if (video.status !== VideoStatus.READY) {
      throw new BadRequestException(
        `Video is not ready for streaming. Current status: ${video.status}`,
      );
    }

    const lesson = video.lesson;
    if (!lesson) {
      throw new NotFoundException('Associated lesson not found');
    }

    // 3. Check access: lesson.free OR user enrolled in course
    if (!lesson.free) {
      const courseId = lesson.module.course.id;
      const enrollment = await this.enrollmentRepository.findOne({
        where: {
          userId,
          courseId,
        },
      });

      if (!enrollment) {
        throw new ForbiddenException(
          'You must be enrolled in this course to access this video',
        );
      }

      // Update last accessed time
      enrollment.lastAccessedAt = new Date();
      await this.enrollmentRepository.save(enrollment);
    }

    // 4. Generate signed URL using cloudinaryService.getSignedVideoUrl()
    const streamUrl = this.cloudinaryService.getSignedVideoUrl(
      video.cloudinaryPublicId,
    );

    // 5. Return { streamUrl, duration }
    return {
      streamUrl,
      duration: video.duration,
    };
  }

  async handleWebhook(payload: Record<string, unknown>): Promise<void> {
    try {
      // Cloudinary webhook payload structure varies, but typically includes public_id
      const publicId = (payload as Record<string, string>).public_id;
      const notificationType = (payload as Record<string, string>)
        .notification_type;

      if (!publicId) {
        throw new BadRequestException(
          'Invalid webhook payload: missing public_id',
        );
      }

      // Find video by Cloudinary public ID
      const video = await this.videoRepository.findOne({
        where: { cloudinaryPublicId: publicId },
      });

      if (!video) {
        this.logger.warn(`Video not found for public_id: ${publicId}`);
        return;
      }

      // Update video status based on notification type
      if (notificationType === 'upload' || notificationType === 'eager') {
        video.status = VideoStatus.READY;
        video.processedAt = new Date();
        await this.videoRepository.save(video);
      } else if (notificationType === 'delete') {
        // Handle deletion if needed
        this.logger.log(`Video deleted: ${publicId}`);
      }
    } catch (error) {
      this.logger.error('Webhook processing error:', error);
      throw error;
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    // 1. Find video
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['lesson'],
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    try {
      // 2. Delete from Cloudinary
      await this.cloudinaryService.deleteVideo(video.cloudinaryPublicId);
    } catch (error) {
      this.logger.error('Failed to delete video from Cloudinary:', error);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // 3. Update lesson (set videoId = null, duration = 0)
    if (video.lesson) {
      video.lesson.videoId = null!;
      video.lesson.duration = 0;
      await this.lessonRepository.save(video.lesson);
    }

    // 4. Delete video record
    await this.videoRepository.remove(video);
  }

  async findById(videoId: string): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['lesson'],
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }
}
