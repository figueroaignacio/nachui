import { LandingHero } from '@/features/landing/components/landing-hero';
import { LandingInstall } from '@/features/landing/components/landing-install';
import { LandingShowcase } from '@/features/landing/components/landing-showcase';

export function HomeView() {
  return (
    <div className="relative flex flex-col">
      <LandingHero />
      <LandingShowcase />
      <LandingInstall />
    </div>
  );
}
