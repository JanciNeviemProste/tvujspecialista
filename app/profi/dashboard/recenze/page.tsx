'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsApi } from '@/lib/api/reviews';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Review } from '@/types/review';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data } = await reviewsApi.getMyReviews();
        setReviews(data as Review[]);
      } catch {
        toast.error('Nepodarilo se nacist recenze');
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadReviews();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <a href="/" className="text-2xl font-bold text-blue-600">
              tvujspecialista.cz
            </a>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">Nacitani recenzi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
        : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-6">
            <a href="/profi/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Recenze</h1>
          <p className="text-gray-600">Prehled vsech recenzi od vasich klientu</p>
        </div>

        {/* Souhrn hodnoceni */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Prumerne hodnoceni */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} />
                <p className="mt-2 text-sm text-gray-500">
                  {reviews.length} {reviews.length === 1 ? 'recenze' : reviews.length >= 2 && reviews.length <= 4 ? 'recenze' : 'recenzi'}
                </p>
              </div>

              {/* Distribuce hodnoceni */}
              <div className="space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="w-8 text-right text-sm text-gray-600">
                      {item.stars} &#9733;
                    </span>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-yellow-400"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 text-right text-sm text-gray-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seznam recenzi */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {review.customerName}
                        </h3>
                        {review.verified && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Overeno
                          </span>
                        )}
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="mt-3 text-gray-700">{review.text}</p>
                      {review.response && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4">
                          <p className="mb-1 text-sm font-medium text-gray-600">
                            Vase odpoved:
                          </p>
                          <p className="text-sm text-gray-700">{review.response.text}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Zatim zadne recenze
              </h3>
              <p className="text-gray-600">
                Jakmile klienti zanechaji recenze, zobrazi se zde.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
