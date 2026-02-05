import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Module } from './module.entity';
import { Enrollment } from './enrollment.entity';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseCategory {
  REAL_ESTATE = 'real_estate',
  FINANCIAL = 'financial',
  BOTH = 'both',
}

@Entity('courses')
@Index(['slug'], { unique: true })
@Index(['category', 'published'])
@Index(['featured', 'published'])
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({
    type: 'enum',
    enum: CourseCategory,
    default: CourseCategory.BOTH,
  })
  category: CourseCategory;

  @Column()
  instructorName: string;

  @Column('text')
  instructorBio: string;

  @Column()
  instructorPhoto: string;

  @Column({ type: 'int', default: 0 })
  duration: number; // total minutes

  @Column({ type: 'int', default: 0 })
  moduleCount: number;

  @Column({ type: 'int', default: 0 })
  lessonCount: number;

  @Column({ type: 'int', default: 0 })
  enrollmentCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number; // 0-5

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ default: false })
  published: boolean;

  @Column({ default: false })
  featured: boolean;

  @Column({ type: 'int', default: 0 })
  position: number; // for ordering

  @OneToMany(() => Module, (module) => module.course, { cascade: true })
  modules: Module[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
