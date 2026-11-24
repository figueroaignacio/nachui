import { LandingCatalog } from '@/features/landing/components/landing-catalog';
import { LandingHero } from '@/features/landing/components/landing-hero';

export function HomeView() {
  return (
    <div className="relative flex flex-col pb-16">
      <LandingHero />
      <LandingCatalog />
    </div>
  );
}
