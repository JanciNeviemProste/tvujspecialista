import { SpecialistaV4 } from '@/components/design-variants/specialista/v4/SpecialistaV4';
import { SpecialistaSwitcher } from '@/components/design-variants/SpecialistaSwitcher';
import { getMockSpecialistDetail } from '@/components/design-variants/specialista/mockDetail';

export default function SpecialistaDesignV4Page() {
  const specialist = getMockSpecialistDetail();
  return (
    <>
      <SpecialistaV4 specialist={specialist} />
      <SpecialistaSwitcher />
    </>
  );
}
