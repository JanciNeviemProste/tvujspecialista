'use client';

import { memo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, Trash2, Pencil } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { cs, sk, enUS, pl } from 'date-fns/locale';
import { cn } from '@/lib/utils/cn';
import { useUpdatePost } from '@/lib/hooks/useForum';
import type { ForumPost } from '@/types/forum';
import { EditableText } from '@/components/editor/EditableText';

const dateFnsLocaleMap: Record<string, typeof cs> = { cs, sk, en: enUS, pl };

interface PostCardProps {
  post: ForumPost;
  currentUserId?: string;
  isAdmin?: boolean;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  isLiking?: boolean;
}

function PostCardInner({ post, currentUserId, isAdmin, onLike, onDelete, isLiking }: PostCardProps) {
  const locale = useLocale();
  const t = useTranslations('forum');
  const authorInitials = post.author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isOwn = currentUserId === post.authorId;
  const isAuthor = isOwn;
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const updatePost = useUpdatePost();

  return (
    <Card>
      <CardContent className="p-6">
        {/* Author header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: dateFnsLocaleMap[locale] || cs,
                })}
                {post.isEdited && ` ($<EditableText tKey="forum.post.edited">{t('post.edited')}</EditableText>)`}
              </p>
            </div>
          </div>

          {/* Edit and Delete buttons */}
          <div className="flex items-center gap-1">
            {isAuthor && (
              <button
                onClick={() => { setEditing(true); setEditContent(post.content); }}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                title={t('post.edit')}
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {(isOwn || isAdmin) && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {editing ? (
          <div className="mt-2 space-y-2">
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  updatePost.mutate({ postId: post.id, content: editContent });
                  setEditing(false);
                }}
                disabled={!editContent.trim() || updatePost.isPending}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <EditableText tKey="forum.post.save">{t('post.save')}</EditableText>
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-gray-300 dark:border-border px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-foreground hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-muted transition-colors"
              >
                <EditableText tKey="forum.post.cancelEdit">{t('post.cancelEdit')}</EditableText>
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none mb-4 whitespace-pre-wrap">
            {post.content}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike?.(post.id)}
            disabled={isLiking}
            className={cn(
              'gap-2',
              post.hasLiked && 'text-primary'
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likesCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export const PostCard = memo(PostCardInner);
