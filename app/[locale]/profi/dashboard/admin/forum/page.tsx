'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useForumCategories } from '@/lib/hooks/useForum';
import { forumApi } from '@/lib/api/forum';
import { ArrowLeft, MessageSquare, Pin, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function AdminForumPage() {
  const router = useRouter();
  const t = useTranslations('dashboard.admin.forum');
  const tAdmin = useTranslations('dashboard.admin');
  const { user, isLoading: authLoading } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useForumCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch topics for selected category
  const { data: topicsData, isLoading: topicsLoading } = useQuery({
    queryKey: ['adminForumTopics', selectedCategory],
    queryFn: () => forumApi.getTopics(selectedCategory!, { limit: 50 }).then((res) => res.data),
    enabled: !!selectedCategory,
  });

  if (!authLoading && (!user || user.role !== 'admin')) {
    router.push('/profi/dashboard');
    return null;
  }

  const handlePin = async (topicId: string) => {
    try {
      await forumApi.pinTopic(topicId);
      toast.success(tAdmin('toasts.topicPinToggled'));
      queryClient.invalidateQueries({ queryKey: ['adminForumTopics'] });
    } catch {
      toast.error(tAdmin('toasts.actionFailed'));
    }
  };

  const handleLock = async (topicId: string) => {
    try {
      await forumApi.lockTopic(topicId);
      toast.success(tAdmin('toasts.topicLockToggled'));
      queryClient.invalidateQueries({ queryKey: ['adminForumTopics'] });
    } catch {
      toast.error(tAdmin('toasts.actionFailed'));
    }
  };

  if (authLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profi/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">{categories?.length ?? 0} kategórií</p>
        </div>
      </div>

      {/* Category selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {categories?.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              selectedCategory === cat.slug ? 'border-primary bg-primary/5' : 'bg-white hover:border-gray-300'
            }`}
          >
            <h3 className="font-semibold">{cat.name}</h3>
            <p className="text-sm text-gray-500">{cat.topicCount ?? 0} tém</p>
          </button>
        ))}
      </div>

      {/* Topics list */}
      {selectedCategory && (
        <>
          <h2 className="text-lg font-semibold mb-4">
            Témy v kategórii
          </h2>
          {topicsLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : topicsData?.topics && topicsData.topics.length > 0 ? (
            <div className="space-y-3">
              {topicsData.topics.map((topic: any) => (
                <div key={topic.id} className="rounded-lg border bg-white p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {topic.isPinned && <Pin className="h-3 w-3 text-primary" />}
                      {topic.isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                      <h3 className="font-semibold">{topic.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {topic.author?.name ?? 'Neznámy'} &middot; {topic.replyCount ?? 0} odpovedí &middot; {topic.viewCount ?? 0} zobrazení
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePin(topic.id)}
                      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${topic.isPinned ? 'text-primary' : 'text-gray-400'}`}
                      title={topic.isPinned ? 'Odopnúť' : 'Pripnúť'}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleLock(topic.id)}
                      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${topic.isLocked ? 'text-red-500' : 'text-gray-400'}`}
                      title={topic.isLocked ? 'Odomknúť' : 'Zamknúť'}
                    >
                      {topic.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Žiadne témy v tejto kategórii
            </div>
          )}
        </>
      )}
    </div>
  );
}
