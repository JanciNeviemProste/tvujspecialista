import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

export enum VideoStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  lessonId: string;

  @Column()
  title: string;

  @Column()
  cloudinaryPublicId: string;

  @Column()
  cloudinaryUrl: string;

  @Column({ type: 'int', default: 0 })
  duration: number; // seconds

  @Column()
  thumbnailUrl: string;

  @Column({ nullable: true })
  transcriptUrl: string;

  @Column({ default: '720p' })
  resolution: string; // 1080p, 720p, 480p

  @Column({ type: 'bigint', default: 0 })
  fileSize: string; // bytes (stored as string for bigint)

  @Column({ type: 'timestamp', nullable: true })
  uploadedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({
    type: 'enum',
    enum: VideoStatus,
    default: VideoStatus.UPLOADING,
  })
  status: VideoStatus;

  @OneToOne(() => Lesson, (lesson) => lesson.video, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;
}
