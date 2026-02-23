import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ForumTopic } from './forum-topic.entity';

@Entity('forum_categories')
@Index(['slug'], { unique: true })
@Index(['position'])
export class ForumCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column({ default: 'MessageSquare' })
  icon: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @Column({ type: 'int', default: 0 })
  topicCount: number;

  @OneToMany(() => ForumTopic, (topic) => topic.category)
  topics: ForumTopic[];

  @CreateDateColumn()
  createdAt: Date;
}
