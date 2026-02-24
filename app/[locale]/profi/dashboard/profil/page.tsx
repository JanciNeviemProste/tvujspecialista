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
  hourlyRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Hodinova sazba musi byt kladne cislo',
  }),
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
      hourlyRate: '0',
      availability: '',
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await specialistsApi.getMyProfile();
        const specialist = data as Specialist;
        if (specialist.photo) setPhotoUrl(specialist.photo);
        reset({
          name: specialist.name || '',
          phone: specialist.phone || '',
          bio: specialist.bio || '',
          services: (specialist.services || []).join(', '),
          certifications: (specialist.certifications || []).join(', '),
          education: specialist.education || '',
          website: specialist.website || '',
          linkedin: specialist.linkedin || '',
          hourlyRate: String(specialist.hourlyRate || 0),
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
        hourlyRate: Number(values.hourlyRate) || 0,
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
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200">
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="hourlyRate">{t('professional.hourlyRate')}</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min={0}
                    {...register('hourlyRate')}
                    error={errors.hourlyRate?.message}
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
