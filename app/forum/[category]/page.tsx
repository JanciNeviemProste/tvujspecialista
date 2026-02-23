'use client';

import { use, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForumTopics } from '@/lib/hooks/useForum';
import { TopicRow } from '@/components/forum/TopicRow';
import { TopicsListSkeleton } from '@/components/forum/LoadingStates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PenSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  // Debounce search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  const { data, isLoading: topicsLoading } = useForumTopics(category, {
    search: debouncedSearch || undefined,
    page,
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.ceil(data.total / data.limit);
  }, [data]);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/profi/prihlaseni');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {category.replace(/-/g, ' ')}
        </h1>
        <Link href={`/forum/nova-tema?category=${category}`}>
          <Button className="gap-2">
            <PenSquare className="h-4 w-4" />
            Nová téma
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Hľadať témy..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Topics list */}
      {authLoading || topicsLoading ? (
        <TopicsListSkeleton />
      ) : data && data.topics.length > 0 ? (
        <div className="space-y-3">
          {data.topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              categorySlug={category}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold mb-2">Zatiaľ žiadne témy</h3>
          <p className="text-muted-foreground mb-4">
            {search ? 'Skúste zmeniť vyhľadávanie' : 'Buďte prvý, kto otvorí diskusiu!'}
          </p>
          <Link href={`/forum/nova-tema?category=${category}`}>
            <Button variant="outline" className="gap-2">
              <PenSquare className="h-4 w-4" />
              Vytvoriť tému
            </Button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Strana {page} z {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
