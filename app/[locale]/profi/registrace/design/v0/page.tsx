import RegistrationPage from '@/app/[locale]/profi/registrace/page';
import { RegistraceSwitcher } from '@/components/design-variants/RegistraceSwitcher';

export default function ProfiRegistraceDesignV0Page() {
  return (
    <div className="min-h-screen pb-24">
      <RegistrationPage />
      <RegistraceSwitcher />
    </div>
  );
}
