import { HeroV4 } from '@/components/design-variants/v4/HeroV4';
import { CategoriesV4 } from '@/components/design-variants/v4/Sections/CategoriesV4';
import { FeaturesV4 } from '@/components/design-variants/v4/Sections/FeaturesV4';
import { TestimonialsV4 } from '@/components/design-variants/v4/Sections/TestimonialsV4';
import { FinalCTAV4 } from '@/components/design-variants/v4/Sections/FinalCTAV4';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV4Page() {
  return (
    <div data-theme="v4" className="min-h-screen bg-background pb-24">
      <HeroV4 />
      <CategoriesV4 />
      <FeaturesV4 />
      <TestimonialsV4 />
      <FinalCTAV4 />
      <DesignSwitcher />
    </div>
  );
}
