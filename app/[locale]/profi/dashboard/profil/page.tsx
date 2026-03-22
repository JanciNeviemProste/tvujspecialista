'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { specialistsApi } from '@/lib/api/specialists';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, X } from 'lucide-react';
import type { Specialist } from '@/types/specialist';

const profileSchema = z.object({
  name: z.string().min(2, 'Jmeno musi mit alespon 2 znaky'),
  phone: z.string().min(9, 'Zadejte platne telefonni cislo'),
  bio: z.string().min(10, 'Bio musi mit alespon 10 znaku').max(2000, 'Bio muze mit maximalne 2000 znaku'),
  services: z.string().min(1, 'Zadejte alespon jednu sluzbu'),
  certifications: z.string(),
  education: z.string(),
  website: z.string().url('Zadejte platnou URL adresu').or(z.literal('')).optional(),
  linkedin: z.string().url('Zadejte platnou URL adresu').or(z.literal('')).optional(),
  facebook: z.string().url('Zadejte platnou URL adresu').or(z.literal('')).optional(),
  instagram: z.string().url('Zadejte platnou URL adresu').or(z.literal('')).optional(),
  availability: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const t = useTranslations('dashboard.profile');
  const tActions = useTranslations('common.actions');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [mediaItems, setMediaItems] = useState<Array<{ type: 'image' | 'video'; url: string; caption?: string }>>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      bio: '',
      services: '',
      certifications: '',
      education: '',
      website: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      availability: '',
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await specialistsApi.getMyProfile();
        const specialist = data as Specialist;
        if (specialist.photo) setPhotoUrl(specialist.photo);
        setMediaItems(specialist.mediaGallery || []);
        reset({
          name: specialist.name || '',
          phone: specialist.phone || '',
          bio: specialist.bio || '',
          services: (specialist.services || []).join(', '),
          certifications: (specialist.certifications || []).join(', '),
          education: specialist.education || '',
          website: specialist.website || '',
          linkedin: specialist.linkedin || '',
          facebook: specialist.facebook || '',
          instagram: specialist.instagram || '',
          availability: (specialist.availability || []).join(', '),
        });
      } catch {
        toast.error(t('loadError'));
      } finally {
        setIsLoadingProfile(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user, reset]);

  if (authLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error(t('photo.formatError'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('photo.sizeError'));
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const { data } = await specialistsApi.uploadPhoto(file);
      setPhotoUrl(data.url || data.photo);
      toast.success(t('photo.successToast'));
    } catch {
      toast.error(t('photo.errorToast'));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        bio: values.bio,
        services: values.services.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: values.certifications.split(',').map((s) => s.trim()).filter(Boolean),
        education: values.education,
        website: values.website || undefined,
        linkedin: values.linkedin || undefined,
        facebook: values.facebook || undefined,
        instagram: values.instagram || undefined,
        availability: values.availability.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await specialistsApi.updateProfile(payload);
      toast.success(t('saveSuccess'));
    } catch {
      toast.error(t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const addVideoItem = () => {
    if (!videoUrl.trim()) return;
    const updated = [...mediaItems, { type: 'video' as const, url: videoUrl.trim() }];
    setMediaItems(updated);
    setVideoUrl('');
    saveMediaGallery(updated);
  };

  const removeMediaItem = (index: number) => {
    const updated = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updated);
    saveMediaGallery(updated);
  };

  const saveMediaGallery = async (items: typeof mediaItems) => {
    try {
      await specialistsApi.updateProfile({ mediaGallery: items });
      toast.success(t('gallery.saved'));
    } catch {
      toast.error(t('gallery.saveError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Profilova fotka */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{t('photo.title')}</CardTitle>
            <CardDescription>{t('photo.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-muted">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={t('photo.alt')}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                >
                  {isUploadingPhoto ? t('photo.uploading') : t('photo.upload')}
                </Button>
                <p className="mt-2 text-xs text-gray-500">{t('photo.hint')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Osobni udaje */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('personal.title')}</CardTitle>
              <CardDescription>{t('personal.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">{t('personal.name')}</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    error={errors.name?.message}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('personal.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">{t('personal.about')}</Label>
                <Textarea
                  id="bio"
                  rows={5}
                  {...register('bio')}
                  className="mt-1"
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="education">{t('personal.education')}</Label>
                <Input
                  id="education"
                  {...register('education')}
                  error={errors.education?.message}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Profesni udaje */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('professional.title')}</CardTitle>
              <CardDescription>{t('professional.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="services">{t('professional.services')}</Label>
                <Input
                  id="services"
                  placeholder={t('professional.servicesPlaceholder')}
                  {...register('services')}
                  error={errors.services?.message}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="certifications">{t('professional.certifications')}</Label>
                <Input
                  id="certifications"
                  placeholder={t('professional.certificationsPlaceholder')}
                  {...register('certifications')}
                  error={errors.certifications?.message}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="availability">{t('professional.availability')}</Label>
                <Input
                  id="availability"
                  placeholder={t('professional.availabilityPlaceholder')}
                  {...register('availability')}
                  error={errors.availability?.message}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Online profily */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('online.title')}</CardTitle>
              <CardDescription>{t('online.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="website">{t('online.website')}</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder={t('online.websitePlaceholder')}
                    {...register('website')}
                    error={errors.website?.message}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder={t('online.linkedinPlaceholder')}
                    {...register('linkedin')}
                    error={errors.linkedin?.message}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://facebook.com/vasprofi"
                    {...register('facebook')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://instagram.com/vasprofi"
                    {...register('instagram')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('gallery.title')}</CardTitle>
              <CardDescription>{t('gallery.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing media grid */}
              {mediaItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mediaItems.map((item, index) => (
                    <div key={index} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      {item.type === 'image' ? (
                        <Image src={item.url} alt={item.caption || ''} fill className="object-cover" sizes="200px" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-900 text-white">
                          <Play className="h-8 w-8" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMediaItem(index)}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                          <p className="text-xs text-white truncate">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add video URL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{t('gallery.addVideo')}</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://youtube.com/watch?v=... alebo https://vimeo.com/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addVideoItem}
                    disabled={!videoUrl.trim()}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {t('gallery.add')}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tlacitka */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting || isSaving} loading={isSaving}>
              {isSaving ? t('saving') : t('save')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/profi/dashboard')}
            >
              {tActions('backToDashboard')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
