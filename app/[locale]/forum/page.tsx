'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useForumCategories } from '@/lib/hooks/useForum';
import { CategoryCard } from '@/components/forum/CategoryCard';
import { CategoriesGridSkeleton } from '@/components/forum/LoadingStates';
import { Button } from '@/components/ui/button';
import { MessageSquare, PenSquare } from 'lucide-react';

export default function ForumPage() {
  const t = useTranslations('forum');
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useForumCategories();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/profi/prihlaseni');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          {t('subtitle')}
        </p>
        <Link href="/forum/nova-tema">
          <Button className="gap-2">
            <PenSquare className="h-4 w-4" />
            {t('newTopicButton')}
          </Button>
        </Link>
      </div>

      {/* Categories */}
      {authLoading || categoriesLoading ? (
        <CategoriesGridSkeleton />
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('emptyCategories.title')}</h3>
          <p className="text-muted-foreground">{t('emptyCategories.description')}</p>
        </div>
      )}
    </div>
  );
}
