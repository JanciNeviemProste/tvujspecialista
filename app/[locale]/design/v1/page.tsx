import { HeroEditorial } from '@/components/home/HeroEditorial';
import { LogoMarquee } from '@/components/home/LogoMarquee';
import { BentoStats } from '@/components/home/BentoStats';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV1Page() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <HeroEditorial />
      <LogoMarquee />
      <BentoStats />
      <DesignSwitcher />
    </div>
  );
}
