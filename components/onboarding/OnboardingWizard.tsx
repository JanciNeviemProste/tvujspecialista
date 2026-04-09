'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { specialistsApi } from '@/lib/api/specialists';
import { toast } from 'sonner';
import { Briefcase, Camera, FileText, Award, MapPin, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { regions } from '@/mocks/regions';

import { EditableText } from '@/components/editor/EditableText';
const STEPS = ['basics', 'photo', 'bio', 'credentials', 'regions', 'complete'] as const;

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations('onboarding');
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const czRegions = regions.filter((r) => r.country === 'CZ');

  const [formData, setFormData] = useState({
    category: '',
    location: '',
    yearsExperience: '',
    bio: '',
    services: '',
    education: '',
    certifications: '',
  });

  const icons = [Briefcase, Camera, FileText, Award, MapPin, CheckCircle];

  const handleNext = async () => {
    if (currentStep < STEPS.length - 2) {
      // Save current step data
      setSaving(true);
      try {
        if (currentStep === 0 && formData.category) {
          await specialistsApi.updateProfile({
            category: formData.category,
            location: formData.location || undefined,
            yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : 0,
          });
        } else if (currentStep === 2) {
          await specialistsApi.updateProfile({
            bio: formData.bio,
            services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
          });
        } else if (currentStep === 3) {
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

  const inputClass = 'w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-foreground mb-1';

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
          {/* Step 0: Professional Basics */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <Briefcase className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="text-2xl font-bold dark:text-foreground text-center"><EditableText tKey="onboarding.basics.title">{t('basics.title')}</EditableText></h2>
              <p className="text-gray-600 dark:text-muted-foreground text-center"><EditableText tKey="onboarding.basics.description">{t('basics.description')}</EditableText></p>
              <div>
                <label className={labelClass}><EditableText tKey="onboarding.basics.categoryLabel">{t('basics.categoryLabel')}</EditableText> *</label>
                <select
                  className={inputClass}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value=""><EditableText tKey="onboarding.basics.selectCategory">{t('basics.selectCategory')}</EditableText></option>
                  <option value="Finanční poradce"><EditableText tKey="onboarding.basics.categoryFinancial">{t('basics.categoryFinancial')}</EditableText></option>
                  <option value="Realitní makléř"><EditableText tKey="onboarding.basics.categoryRealEstate">{t('basics.categoryRealEstate')}</EditableText></option>
                </select>
              </div>
              <div>
                <label className={labelClass}><EditableText tKey="onboarding.basics.locationLabel">{t('basics.locationLabel')}</EditableText></label>
                <select
                  className={inputClass}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value=""><EditableText tKey="onboarding.basics.selectLocation">{t('basics.selectLocation')}</EditableText></option>
                  {czRegions.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}><EditableText tKey="onboarding.basics.experienceLabel">{t('basics.experienceLabel')}</EditableText></label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  placeholder={t('basics.experiencePlaceholder')}
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 1: Photo */}
          {currentStep === 1 && (
            <div className="text-center space-y-4">
              <Camera className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="text-2xl font-bold dark:text-foreground"><EditableText tKey="onboarding.photo.title">{t('photo.title')}</EditableText></h2>
              <p className="text-gray-600 dark:text-muted-foreground"><EditableText tKey="onboarding.photo.description">{t('photo.description')}</EditableText></p>
              <p className="text-sm text-gray-500"><EditableText tKey="onboarding.photo.skip">{t('photo.skip')}</EditableText></p>
            </div>
          )}

          {/* Step 2: Bio + Services */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-foreground"><EditableText tKey="onboarding.bio.title">{t('bio.title')}</EditableText></h2>
              <p className="text-gray-600 dark:text-muted-foreground"><EditableText tKey="onboarding.bio.description">{t('bio.description')}</EditableText></p>
              <div>
                <label className={labelClass}><EditableText tKey="onboarding.bio.bioLabel">{t('bio.bioLabel')}</EditableText></label>
                <textarea
                  className={inputClass}
                  rows={4}
                  placeholder={t('bio.bioPlaceholder')}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}><EditableText tKey="onboarding.bio.servicesLabel">{t('bio.servicesLabel')}</EditableText></label>
                <input
                  className={inputClass}
                  placeholder={t('bio.servicesPlaceholder')}
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Credentials */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-foreground"><EditableText tKey="onboarding.credentials.title">{t('credentials.title')}</EditableText></h2>
              <p className="text-gray-600 dark:text-muted-foreground"><EditableText tKey="onboarding.credentials.description">{t('credentials.description')}</EditableText></p>
              <div>
                <label className={labelClass}><EditableText tKey="onboarding.credentials.educationLabel">{t('credentials.educationLabel')}</EditableText></label>
                <input
                  className={inputClass}
                  placeholder={t('credentials.educationPlaceholder')}
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}><EditableText tKey="onboarding.credentials.certificationsLabel">{t('credentials.certificationsLabel')}</EditableText></label>
                <input
                  className={inputClass}
                  placeholder={t('credentials.certificationsPlaceholder')}
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 4: Regions */}
          {currentStep === 4 && (
            <div className="text-center space-y-4">
              <MapPin className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="text-2xl font-bold dark:text-foreground"><EditableText tKey="onboarding.regions.title">{t('regions.title')}</EditableText></h2>
              <p className="text-gray-600 dark:text-muted-foreground"><EditableText tKey="onboarding.regions.description">{t('regions.description')}</EditableText></p>
              <p className="text-sm text-gray-500"><EditableText tKey="onboarding.regions.editLater">{t('regions.editLater')}</EditableText></p>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold dark:text-foreground"><EditableText tKey="onboarding.complete.title">{t('complete.title')}</EditableText></h2>
              <p className="text-gray-600 dark:text-muted-foreground"><EditableText tKey="onboarding.complete.description">{t('complete.description')}</EditableText></p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && currentStep < STEPS.length - 1 && (
              <button
                className="rounded-lg border border-gray-300 dark:border-border px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-foreground hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-muted transition-colors"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <EditableText tKey="onboarding.back">{t('back')}</EditableText>
              </button>
            )}
            <button
              className="ml-auto rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={handleNext}
              disabled={saving || (currentStep === 0 && !formData.category)}
            >
              {saving ? t('saving') : currentStep === STEPS.length - 1 ? t('goToDashboard') : t('next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
