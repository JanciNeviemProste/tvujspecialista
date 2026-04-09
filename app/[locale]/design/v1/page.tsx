import { PremiumHeader } from '@/components/layout/PremiumHeader';
import { HeroEditorial } from '@/components/home/HeroEditorial';
import { LogoMarquee } from '@/components/home/LogoMarquee';
import { BentoStats } from '@/components/home/BentoStats';
import { CategoriesBentoV1 } from '@/components/design-variants/v1/Sections/CategoriesBento';
import { WhyUsBentoV1 } from '@/components/design-variants/v1/Sections/WhyUsBento';
import { TestimonialsPullQuoteV1 } from '@/components/design-variants/v1/Sections/TestimonialsPullQuote';
import { FinalCTAV1 } from '@/components/design-variants/v1/Sections/FinalCTA';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV1Page() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PremiumHeader />
      <HeroEditorial />
      <LogoMarquee />
      <BentoStats />
      <CategoriesBentoV1 />
      <WhyUsBentoV1 />
      <TestimonialsPullQuoteV1 />
      <FinalCTAV1 />
      <DesignSwitcher />
    </div>
  );
}
