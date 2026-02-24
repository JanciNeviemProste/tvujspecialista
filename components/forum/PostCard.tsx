'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';
import { cn } from '@/lib/utils/cn';
import type { ForumPost } from '@/types/forum';

interface PostCardProps {
  post: ForumPost;
  currentUserId?: string;
  isAdmin?: boolean;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  isLiking?: boolean;
}

export function PostCard({ post, currentUserId, isAdmin, onLike, onDelete, isLiking }: PostCardProps) {
  const authorInitials = post.author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isOwn = currentUserId === post.authorId;

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
                  locale: sk,
                })}
                {post.isEdited && ' (upravené)'}
              </p>
            </div>
          </div>

          {/* Delete button (own posts or admin) */}
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

        {/* Content */}
        <div className="prose prose-sm max-w-none mb-4 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike?.(post.id)}
            disabled={isLiking}
            className={cn(
              'gap-2',
              post.likesCount > 0 && 'text-primary'
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
