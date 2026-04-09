import { HeroV5 } from '@/components/design-variants/v5/HeroV5';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV5Page() {
  return (
    <div data-theme="v5" className="min-h-screen bg-background">
      <HeroV5 />
      <DesignSwitcher />
    </div>
  );
}
