export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  position: number;
  topicCount: number;
  createdAt: string;
}

export interface ForumTopicAuthor {
  id: string;
  name: string;
  email: string;
}

export interface ForumTopic {
  id: string;
  categoryId: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt: string | null;
  author: ForumTopicAuthor;
  category?: ForumCategory;
  posts?: ForumPost[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumPost {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  isEdited: boolean;
  editedAt: string | null;
  likesCount: number;
  author: ForumTopicAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface ForumTopicsResponse {
  topics: ForumTopic[];
  total: number;
  page: number;
  limit: number;
}

export interface TopicFilters {
  search: string;
  page: number;
}
