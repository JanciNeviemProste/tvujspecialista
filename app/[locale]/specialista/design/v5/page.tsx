import { SpecialistaV5 } from '@/components/design-variants/specialista/v5/SpecialistaV5';
import { SpecialistaSwitcher } from '@/components/design-variants/SpecialistaSwitcher';
import { getMockSpecialistDetail } from '@/components/design-variants/specialista/mockDetail';

export default function SpecialistaDesignV5Page() {
  const specialist = getMockSpecialistDetail();
  return (
    <>
      <SpecialistaV5 specialist={specialist} />
      <SpecialistaSwitcher />
    </>
  );
}
