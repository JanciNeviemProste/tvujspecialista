import { SpecialistaV1 } from '@/components/design-variants/specialista/v1/SpecialistaV1';
import { SpecialistaSwitcher } from '@/components/design-variants/SpecialistaSwitcher';
import { getMockSpecialistDetail } from '@/components/design-variants/specialista/mockDetail';

export default function SpecialistaDesignV1Page() {
  const specialist = getMockSpecialistDetail();
  return (
    <>
      <SpecialistaV1 specialist={specialist} />
      <SpecialistaSwitcher />
    </>
  );
}
