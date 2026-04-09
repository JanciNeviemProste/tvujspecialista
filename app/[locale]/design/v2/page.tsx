import { HeroV2 } from '@/components/design-variants/v2/HeroV2';
import { CategoriesRowsV2 } from '@/components/design-variants/v2/Sections/CategoriesRowsV2';
import { FeaturesGridV2 } from '@/components/design-variants/v2/Sections/FeaturesGridV2';
import { TestimonialsV2 } from '@/components/design-variants/v2/Sections/TestimonialsV2';
import { FinalCTAV2 } from '@/components/design-variants/v2/Sections/FinalCTAV2';
import { DesignSwitcher } from '@/components/design-variants/DesignSwitcher';

export default function DesignV2Page() {
  return (
    <div data-theme="v2" className="min-h-screen bg-background pb-24">
      <HeroV2 />
      <CategoriesRowsV2 />
      <FeaturesGridV2 />
      <TestimonialsV2 />
      <FinalCTAV2 />
      <DesignSwitcher />
    </div>
  );
}
