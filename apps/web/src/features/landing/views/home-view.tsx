import { LandingLogoCta } from '@/features/landing/components/landing-logo-cta';
import { LandingHero } from '@/features/landing/components/landing-hero';

export function HomeView() {
  return (
    <div className="flex flex-col">
      <LandingHero />
      <LandingLogoCta />
    </div>
  );
}
