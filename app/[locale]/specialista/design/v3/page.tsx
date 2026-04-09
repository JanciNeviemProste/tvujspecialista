import { SpecialistaV3 } from '@/components/design-variants/specialista/v3/SpecialistaV3';
import { SpecialistaSwitcher } from '@/components/design-variants/SpecialistaSwitcher';
import { getMockSpecialistDetail } from '@/components/design-variants/specialista/mockDetail';

export default function SpecialistaDesignV3Page() {
  const specialist = getMockSpecialistDetail();
  return (
    <>
      <SpecialistaV3 specialist={specialist} />
      <SpecialistaSwitcher />
    </>
  );
}
