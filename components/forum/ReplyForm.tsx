'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';

interface ReplyFormProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ReplyForm({ onSubmit, isLoading, disabled }: ReplyFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 2) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Napíšte svoju odpoveď..."
            className="w-full min-h-[100px] p-3 rounded-lg border bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={disabled || isLoading}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={content.trim().length < 2 || isLoading || disabled}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Odosielam...' : 'Odpovedať'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
