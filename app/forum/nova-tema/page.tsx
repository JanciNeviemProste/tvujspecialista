'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForumCategories, useCreateTopic } from '@/lib/hooks/useForum';
import { NewTopicForm } from '@/components/forum/NewTopicForm';
import { CategoriesGridSkeleton } from '@/components/forum/LoadingStates';

export default function NewTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useForumCategories();
  const createTopic = useCreateTopic();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/profi/prihlaseni');
    return null;
  }

  const handleSubmit = async (data: { categoryId: string; title: string; content: string }) => {
    const result = await createTopic.mutateAsync(data);
    // Find category slug for redirect
    const category = categories?.find((c) => c.id === data.categoryId);
    if (category && result) {
      router.push(`/forum/${category.slug}/${result.id}`);
    } else {
      router.push('/forum');
    }
  };

  // Get default category from URL query param
  const categorySlug = searchParams.get('category');
  const defaultCategoryId = categories?.find((c) => c.slug === categorySlug)?.id;

  if (authLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <CategoriesGridSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <NewTopicForm
        categories={categories || []}
        defaultCategoryId={defaultCategoryId}
        onSubmit={handleSubmit}
        isLoading={createTopic.isPending}
      />
    </div>
  );
}
