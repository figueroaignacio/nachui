import { LandingAssistant } from '@/features/landing/components/landing-assistant';
import { LandingCatalog } from '@/features/landing/components/landing-catalog';
import { LandingHero } from '@/features/landing/components/landing-hero';
import { LandingInstall } from '@/features/landing/components/landing-install';
import { LandingShowcase } from '@/features/landing/components/landing-showcase';

export function HomeView() {
  return (
    <div className="relative flex flex-col">
      <LandingHero />
      <LandingShowcase />
      <LandingCatalog />
      <LandingAssistant />
      <LandingInstall />
    </div>
  );
}
