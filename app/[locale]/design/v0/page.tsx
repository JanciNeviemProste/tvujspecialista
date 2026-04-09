import { OriginalHomePage } from '@/components/design-variants/v0/OriginalHomePage';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV0Page() {
  return (
    <div className="min-h-screen bg-white pb-24 dark:bg-neutral-950">
      <OriginalHomePage />
      <DesignSwitcher />
    </div>
  );
}
