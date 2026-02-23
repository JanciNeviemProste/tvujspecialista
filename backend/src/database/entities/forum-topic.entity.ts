import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ForumCategory } from './forum-category.entity';
import { ForumPost } from './forum-post.entity';
import { User } from './user.entity';

@Entity('forum_topics')
@Index(['categoryId'])
@Index(['authorId'])
@Index(['slug'], { unique: true })
@Index(['isPinned', 'lastReplyAt'])
export class ForumTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryId: string;

  @Column()
  authorId: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  replyCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastReplyAt: Date;

  @ManyToOne(() => ForumCategory, (category) => category.topics)
  @JoinColumn({ name: 'categoryId' })
  category: ForumCategory;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => ForumPost, (post) => post.topic, { cascade: true })
  posts: ForumPost[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
