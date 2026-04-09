import SpecialistPageClient from '@/app/[locale]/specialista/[slug]/SpecialistPageClient';
import { SpecialistaSwitcher } from '@/components/design-variants/SpecialistaSwitcher';
import { getMockSpecialistDetail } from '@/components/design-variants/specialista/mockDetail';

export default function SpecialistaDesignV0Page() {
  const specialist = getMockSpecialistDetail();
  return (
    <div className="min-h-screen pb-24">
      <SpecialistPageClient specialist={specialist} />
      <SpecialistaSwitcher />
    </div>
  );
}
