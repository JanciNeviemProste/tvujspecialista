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
import { ForumTopic } from './forum-topic.entity';
import { ForumLike } from './forum-like.entity';
import { User } from './user.entity';

@Entity('forum_posts')
@Index(['topicId'])
@Index(['authorId'])
export class ForumPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  topicId: string;

  @Column()
  authorId: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  editedAt: Date;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @ManyToOne(() => ForumTopic, (topic) => topic.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: ForumTopic;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => ForumLike, (like) => like.post, { cascade: true })
  likes: ForumLike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
