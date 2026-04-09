import { HeroV5 } from '@/components/design-variants/v5/HeroV5';
import { CategoriesV5 } from '@/components/design-variants/v5/Sections/CategoriesV5';
import { FeaturesV5 } from '@/components/design-variants/v5/Sections/FeaturesV5';
import { TestimonialsV5 } from '@/components/design-variants/v5/Sections/TestimonialsV5';
import { FinalCTAV5 } from '@/components/design-variants/v5/Sections/FinalCTAV5';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV5Page() {
  return (
    <div data-theme="v5" className="min-h-screen bg-background pb-24">
      <HeroV5 />
      <CategoriesV5 />
      <FeaturesV5 />
      <TestimonialsV5 />
      <FinalCTAV5 />
      <DesignSwitcher />
    </div>
  );
}
