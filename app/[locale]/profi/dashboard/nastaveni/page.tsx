'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Zadejte soucasne heslo'),
    newPassword: z.string().min(8, 'Nove heslo musi mit alespon 8 znaku'),
    confirmPassword: z.string().min(1, 'Potvrdte nove heslo'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hesla se neshoduji',
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function AccountSettingsPage() {
  const t = useTranslations('dashboard.settings');
  const tActions = useTranslations('common.actions');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">{tActions('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(t('successToast'));
      reset();
    } catch {
      toast.error(t('errorToast'));
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

        {/* Informace o uctu */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{t('accountInfo')}</CardTitle>
            <CardDescription>{t('accountInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-500">{t('name')}</Label>
                <p className="mt-1 font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <Label className="text-gray-500">{t('email')}</Label>
                <p className="mt-1 font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zmena hesla */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t('changePassword')}</CardTitle>
            <CardDescription>
              {t('changePasswordDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
              <div>
                <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register('currentPassword')}
                  error={errors.currentPassword?.message}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">{t('newPassword')}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                  error={errors.newPassword?.message}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t('newPasswordHint')}
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button type="submit" disabled={isSubmitting || isSaving} loading={isSaving}>
                  {isSaving ? t('savingPassword') : t('savePassword')}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
