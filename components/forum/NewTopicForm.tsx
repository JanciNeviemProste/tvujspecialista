'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import type { ForumCategory } from '@/types/forum';

interface NewTopicFormProps {
  categories: ForumCategory[];
  defaultCategoryId?: string;
  onSubmit: (data: { categoryId: string; title: string; content: string }) => void;
  isLoading?: boolean;
}

export function NewTopicForm({ categories, defaultCategoryId, onSubmit, isLoading }: NewTopicFormProps) {
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
        <CardTitle>Nová téma</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category select */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategória</Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm"
              disabled={isLoading}
            >
              <option value="">Vyberte kategóriu...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Nadpis</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O čom chcete diskutovať?"
              disabled={isLoading}
              minLength={5}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{title.length}/200</p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Obsah</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Popíšte svoju tému podrobnejšie..."
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
              {isLoading ? 'Vytváram...' : 'Vytvoriť tému'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
