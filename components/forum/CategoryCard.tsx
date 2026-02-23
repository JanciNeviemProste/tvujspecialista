'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  DollarSign,
  Scale,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import type { ForumCategory } from '@/types/forum';

const iconMap: Record<string, React.ElementType> = {
  Home,
  DollarSign,
  Scale,
  TrendingUp,
  MessageSquare,
};

interface CategoryCardProps {
  category: ForumCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || MessageSquare;

  return (
    <Link href={`/forum/${category.slug}`}>
      <Card variant="interactive" className="h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {category.description}
              </p>
              <Badge variant="outline">
                {category.topicCount} {category.topicCount === 1 ? 'téma' : 'tém'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
