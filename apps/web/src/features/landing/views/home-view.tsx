import { LandingAssistant } from '@/features/landing/components/landing-assistant';
import { LandingCatalog } from '@/features/landing/components/landing-catalog';
import { LandingHero } from '@/features/landing/components/landing-hero';
import { LandingInstall } from '@/features/landing/components/landing-install';
import { LandingShowcase } from '@/features/landing/components/landing-showcase';

export function HomeView() {
  return (
    <div className="relative flex flex-col gap-20 pb-10 md:gap-28">
      <LandingHero />
      <LandingShowcase />
      <LandingCatalog />
      <LandingAssistant />
      <LandingInstall />
    </div>
  );
}
