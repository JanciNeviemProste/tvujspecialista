'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { specialistsApi } from '@/lib/api/specialists';
import { toast } from 'sonner';
import { Camera, FileText, Award, MapPin, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const STEPS = ['photo', 'bio', 'credentials', 'regions', 'complete'] as const;

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations('onboarding');
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    bio: '',
    services: '',
    education: '',
    certifications: '',
  });

  const icons = [Camera, FileText, Award, MapPin, CheckCircle];

  const handleNext = async () => {
    if (currentStep < STEPS.length - 2) {
      // Save current step data
      setSaving(true);
      try {
        if (currentStep === 1) {
          await specialistsApi.updateProfile({
            bio: formData.bio,
            services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
          });
        } else if (currentStep === 2) {
          await specialistsApi.updateProfile({
            education: formData.education,
            certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
          });
        }
      } catch {
        toast.error(t('saveError'));
      } finally {
        setSaving(false);
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === STEPS.length - 2) {
      // Last real step -> mark onboarding complete
      setSaving(true);
      try {
        await specialistsApi.updateProfile({ onboardingCompleted: true } as Record<string, unknown>);
        setCurrentStep(currentStep + 1);
      } catch {
        toast.error(t('saveError'));
      } finally {
        setSaving(false);
      }
    } else {
      // Complete step -> go to dashboard
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, i) => {
              const Icon = icons[i];
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                    i <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-neutral-700'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border bg-white dark:bg-card p-8 shadow-lg">
          {/* Step 0: Photo */}
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <Camera className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="text-2xl font-bold dark:text-foreground">{t('photo.title')}</h2>
              <p className="text-gray-600 dark:text-muted-foreground">{t('photo.description')}</p>
              <p className="text-sm text-gray-500">{t('photo.skip')}</p>
            </div>
          )}

          {/* Step 1: Bio + Services */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-foreground">{t('bio.title')}</h2>
              <p className="text-gray-600 dark:text-muted-foreground">{t('bio.description')}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">{t('bio.bioLabel')}</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  rows={4}
                  placeholder={t('bio.bioPlaceholder')}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">{t('bio.servicesLabel')}</label>
                <input
                  className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={t('bio.servicesPlaceholder')}
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Credentials */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-foreground">{t('credentials.title')}</h2>
              <p className="text-gray-600 dark:text-muted-foreground">{t('credentials.description')}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">{t('credentials.educationLabel')}</label>
                <input
                  className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={t('credentials.educationPlaceholder')}
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">{t('credentials.certificationsLabel')}</label>
                <input
                  className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={t('credentials.certificationsPlaceholder')}
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Regions */}
          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <MapPin className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="text-2xl font-bold dark:text-foreground">{t('regions.title')}</h2>
              <p className="text-gray-600 dark:text-muted-foreground">{t('regions.description')}</p>
              <p className="text-sm text-gray-500">{t('regions.editLater')}</p>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold dark:text-foreground">{t('complete.title')}</h2>
              <p className="text-gray-600 dark:text-muted-foreground">{t('complete.description')}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && currentStep < STEPS.length - 1 && (
              <button
                className="rounded-lg border border-gray-300 dark:border-border px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted transition-colors"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                {t('back')}
              </button>
            )}
            <button
              className="ml-auto rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? t('saving') : currentStep === STEPS.length - 1 ? t('goToDashboard') : t('next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
