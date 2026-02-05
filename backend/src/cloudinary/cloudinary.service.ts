import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../database/entities/specialist.entity';

@Injectable()
export class CloudinaryService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
  ) {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');

    if (
      cloudName &&
      cloudName !== 'your-cloud-name' &&
      apiKey &&
      apiKey !== 'your-api-key' &&
      apiSecret &&
      apiSecret !== 'your-api-secret'
    ) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  async uploadImage(file: any, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tvujspecialista/profiles',
          public_id: `profile_${userId}_${Date.now()}`,
          transformation: [{ width: 400, height: 400, crop: 'fill' }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: no result'));
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async updateProfilePhoto(userId: string, file: any) {
    const specialist = await this.specialistRepository.findOne({ where: { userId } });
    if (!specialist) {
      throw new Error('Specialist not found');
    }

    const imageUrl = await this.uploadImage(file, userId);

    specialist.photo = imageUrl;
    await this.specialistRepository.save(specialist);

    return { photo: imageUrl };
  }

  async uploadVideo(
    file: any,
    lessonId: string,
    title: string,
  ): Promise<{ publicId: string; url: string; duration: number; thumbnailUrl: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tvujspecialista/academy/videos',
          public_id: `lesson_${lessonId}_${Date.now()}`,
          resource_type: 'video',
          chunk_size: 6000000, // 6MB chunks for large files
          eager: [
            {
              width: 1280,
              height: 720,
              quality: 'auto',
              format: 'mp4',
            },
          ],
          eager_async: true, // Avoid timeout during processing
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Video upload failed: no result'));

          // Generate thumbnail URL
          const thumbnailUrl = cloudinary.url(result.public_id, {
            resource_type: 'video',
            format: 'jpg',
            transformation: [
              { width: 640, height: 360, crop: 'fill' },
            ],
          });

          resolve({
            publicId: result.public_id,
            url: result.secure_url,
            duration: Math.round(result.duration || 0),
            thumbnailUrl,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async getSignedVideoUrl(publicId: string, expiresIn: number = 3600): Promise<string> {
    // Generate signed URL for secure streaming
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      sign_url: true,
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    });

    return signedUrl;
  }

  async deleteVideo(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'video' },
        (error, result) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }
}
