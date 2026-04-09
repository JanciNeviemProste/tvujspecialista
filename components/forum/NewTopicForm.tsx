'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import type { ForumCategory } from '@/types/forum';
import { EditableText } from '@/components/editor/EditableText';

interface NewTopicFormProps {
  categories: ForumCategory[];
  defaultCategoryId?: string;
  onSubmit: (data: { categoryId: string; title: string; content: string }) => void;
  isLoading?: boolean;
}

export function NewTopicForm({ categories, defaultCategoryId, onSubmit, isLoading }: NewTopicFormProps) {
  const t = useTranslations('forum');
  const [categoryId, setCategoryId] = useState(defaultCategoryId || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || title.trim().length < 5 || content.trim().length < 10) return;
    onSubmit({
      categoryId,
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle><EditableText tKey="forum.newTopic.title">{t('newTopic.title')}</EditableText></CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category select */}
          <div className="space-y-2">
            <Label htmlFor="category"><EditableText tKey="forum.newTopic.category">{t('newTopic.category')}</EditableText></Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm"
              disabled={isLoading}
            >
              <option value=""><EditableText tKey="forum.newTopic.categoryPlaceholder">{t('newTopic.categoryPlaceholder')}</EditableText></option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title"><EditableText tKey="forum.newTopic.topicTitle">{t('newTopic.topicTitle')}</EditableText></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('newTopic.topicTitlePlaceholder')}
              disabled={isLoading}
              minLength={5}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{title.length}/200</p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content"><EditableText tKey="forum.newTopic.content">{t('newTopic.content')}</EditableText></Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('newTopic.contentPlaceholder')}
              className="w-full min-h-[200px] p-3 rounded-lg border bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              disabled={isLoading}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!categoryId || title.trim().length < 5 || content.trim().length < 10 || isLoading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? t('newTopic.submitting') : t('newTopic.submit')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
