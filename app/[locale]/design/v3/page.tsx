import { HeroV3 } from '@/components/design-variants/v3/HeroV3';
import { CategoriesV3 } from '@/components/design-variants/v3/Sections/CategoriesV3';
import { FeaturesV3 } from '@/components/design-variants/v3/Sections/FeaturesV3';
import { TestimonialV3 } from '@/components/design-variants/v3/Sections/TestimonialV3';
import { FinalCTAV3 } from '@/components/design-variants/v3/Sections/FinalCTAV3';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV3Page() {
  return (
    <div data-theme="v3" className="min-h-screen bg-background pb-24">
      <HeroV3 />
      <CategoriesV3 />
      <FeaturesV3 />
      <TestimonialV3 />
      <FinalCTAV3 />
      <DesignSwitcher />
    </div>
  );
}
