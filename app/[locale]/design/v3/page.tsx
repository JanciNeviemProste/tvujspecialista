import { HeroV3 } from '@/components/design-variants/v3/HeroV3';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV3Page() {
  return (
    <div data-theme="v3" className="min-h-screen bg-background">
      <HeroV3 />
      <DesignSwitcher />
    </div>
  );
}
