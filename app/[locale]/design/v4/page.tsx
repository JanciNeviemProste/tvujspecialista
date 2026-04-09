import { HeroV4 } from '@/components/design-variants/v4/HeroV4';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV4Page() {
  return (
    <div data-theme="v4" className="min-h-screen bg-background">
      <HeroV4 />
      <DesignSwitcher />
    </div>
  );
}
