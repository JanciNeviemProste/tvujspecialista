'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Eye, Pin, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';
import type { ForumTopic } from '@/types/forum';

interface TopicRowProps {
  topic: ForumTopic;
  categorySlug: string;
}

export function TopicRow({ topic, categorySlug }: TopicRowProps) {
  const authorInitials = topic.author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Link href={`/forum/${categorySlug}/${topic.id}`}>
      <Card variant="interactive">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Author avatar */}
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>

            {/* Topic info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {topic.isPinned && (
                  <Pin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                )}
                {topic.isLocked && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
                <h3 className="font-medium truncate">{topic.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {topic.author.name} &middot;{' '}
                {formatDistanceToNow(new Date(topic.createdAt), {
                  addSuffix: true,
                  locale: sk,
                })}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 flex-shrink-0 text-sm text-muted-foreground">
              <div className="flex items-center gap-1" title="Odpovede">
                <MessageSquare className="h-4 w-4" />
                <span>{topic.replyCount}</span>
              </div>
              <div className="flex items-center gap-1" title="Zobrazenia">
                <Eye className="h-4 w-4" />
                <span>{topic.viewCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
