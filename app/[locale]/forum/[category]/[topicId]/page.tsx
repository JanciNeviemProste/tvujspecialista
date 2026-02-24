'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useForumTopic, useCreatePost, useToggleLike, useDeletePost } from '@/lib/hooks/useForum';
import { PostCard } from '@/components/forum/PostCard';
import { ReplyForm } from '@/components/forum/ReplyForm';
import { TopicDetailSkeleton } from '@/components/forum/LoadingStates';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pin, Lock, Eye, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';

interface TopicDetailPageProps {
  params: Promise<{ category: string; topicId: string }>;
}

export default function TopicDetailPage({ params }: TopicDetailPageProps) {
  const t = useTranslations('forum.topic');
  const { category, topicId } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: topic, isLoading: topicLoading } = useForumTopic(topicId);
  const createPost = useCreatePost(topicId);
  const toggleLike = useToggleLike();
  const deletePost = useDeletePost(topicId);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/profi/prihlaseni');
    return null;
  }

  if (authLoading || topicLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TopicDetailSkeleton />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">{t('notFound')}</h2>
        <p className="text-muted-foreground">{t('notFoundDesc')}</p>
      </div>
    );
  }

  const authorInitials = topic.author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleReply = (content: string) => {
    createPost.mutate({ content });
  };

  const handleLike = (postId: string) => {
    toggleLike.mutate(postId);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm(t('deleteConfirm'))) {
      deletePost.mutate(postId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Topic header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {topic.isPinned && <Pin className="h-4 w-4 text-primary" />}
          {topic.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          <h1 className="text-2xl font-bold">{topic.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
            </Avatar>
            <span>{topic.author.name}</span>
          </div>
          <span>
            {formatDistanceToNow(new Date(topic.createdAt), {
              addSuffix: true,
              locale: sk,
            })}
          </span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{topic.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{topic.replyCount}</span>
          </div>
        </div>
      </div>

      {/* Original post (topic content) */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {topic.content}
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      {topic.posts && topic.posts.length > 0 && (
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold">
            {t('replies', { count: topic.posts.length })}
          </h2>
          {topic.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id}
              onLike={handleLike}
              onDelete={handleDelete}
              isLiking={toggleLike.isPending}
            />
          ))}
        </div>
      )}

      {/* Reply form */}
      {topic.isLocked ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Lock className="h-6 w-6 mx-auto mb-2" />
            <p>{t('locked')}</p>
          </CardContent>
        </Card>
      ) : (
        <ReplyForm
          onSubmit={handleReply}
          isLoading={createPost.isPending}
        />
      )}
    </div>
  );
}
