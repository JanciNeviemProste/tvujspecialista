import { HeroV2 } from '@/components/design-variants/v2/HeroV2';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV2Page() {
  return (
    <div data-theme="v2" className="min-h-screen bg-background pb-24">
      <HeroV2 />
      <DesignSwitcher />
    </div>
  );
}
