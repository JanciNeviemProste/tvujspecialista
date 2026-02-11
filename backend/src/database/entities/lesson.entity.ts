import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Module } from './module.entity';
import { Video } from './video.entity';
import { LessonProgress } from './lesson-progress.entity';

export enum LessonType {
  VIDEO = 'video',
  QUIZ = 'quiz',
  READING = 'reading',
  ASSIGNMENT = 'assignment',
}

@Entity('lessons')
@Index(['moduleId', 'position'])
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  moduleId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'int', default: 0 })
  position: number; // order within module

  @Column({ nullable: true })
  videoId: string;

  @Column({ type: 'int', default: 0 })
  duration: number; // minutes

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.VIDEO,
  })
  type: LessonType;

  @Column({ type: 'jsonb', nullable: true })
  content: Record<string, unknown> | null; // for non-video lessons

  @Column({ default: false })
  published: boolean;

  @Column({ default: false })
  free: boolean; // preview lesson

  @ManyToOne(() => Module, (module) => module.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @OneToOne(() => Video, (video) => video.lesson, { cascade: true })
  video: Video;

  @OneToMany(() => LessonProgress, (progress) => progress.lesson)
  progress: LessonProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
