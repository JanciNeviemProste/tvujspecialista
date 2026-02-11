'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        toast.error('Nepodařilo se načíst profil');
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
        <header className="border-b bg-white">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              tvujspecialista.cz
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">Nacitani profilu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

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
      toast.success('Profil byl uspesne ulozen');
    } catch {
      toast.error('Nepodařilo se ulozit profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/profi/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Upravit profil</h1>
          <p className="text-gray-600">Aktualizujte sve osobni a profesni udaje</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Osobni udaje */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Osobni udaje</CardTitle>
              <CardDescription>Zakladni informace o vas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Jmeno a prijmeni *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    error={errors.name?.message}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
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
                <Label htmlFor="bio">O mne *</Label>
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
                <Label htmlFor="education">Vzdelani</Label>
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
              <CardTitle className="text-xl">Profesni udaje</CardTitle>
              <CardDescription>Vase sluzby, certifikace a dostupnost</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="services">Sluzby * (oddelene carkou)</Label>
                <Input
                  id="services"
                  placeholder="napr. Financni poradenstvi, Investice, Pojisteni"
                  {...register('services')}
                  error={errors.services?.message}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="certifications">Certifikace (oddelene carkou)</Label>
                <Input
                  id="certifications"
                  placeholder="napr. EFA, CFP, ICI"
                  {...register('certifications')}
                  error={errors.certifications?.message}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="hourlyRate">Hodinova sazba (Kc)</Label>
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
                  <Label htmlFor="availability">Dostupnost (oddelene carkou)</Label>
                  <Input
                    id="availability"
                    placeholder="napr. Po-Pa 9:00-17:00, So 10:00-14:00"
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
              <CardTitle className="text-xl">Online profily</CardTitle>
              <CardDescription>Odkazy na vase webove stranky a socialni site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="website">Webova stranka</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.example.cz"
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
                    placeholder="https://linkedin.com/in/vas-profil"
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
              {isSaving ? 'Ukladam...' : 'Ulozit zmeny'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/profi/dashboard')}
            >
              Zpet na dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
