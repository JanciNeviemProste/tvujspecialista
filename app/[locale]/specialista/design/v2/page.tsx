import { SpecialistaV2 } from '@/components/design-variants/specialista/v2/SpecialistaV2';
import { SpecialistaSwitcher } from '@/components/design-variants/SpecialistaSwitcher';
import { getMockSpecialistDetail } from '@/components/design-variants/specialista/mockDetail';

export default function SpecialistaDesignV2Page() {
  const specialist = getMockSpecialistDetail();
  return (
    <>
      <SpecialistaV2 specialist={specialist} />
      <SpecialistaSwitcher />
    </>
  );
}
