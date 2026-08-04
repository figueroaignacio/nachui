import { AsciiBackdrop } from '@/components/common/ascii-backdrop';
import { LandingHero } from '@/features/landing/components/landing-hero';
import { LandingLogoCta } from '@/features/landing/components/landing-logo-cta';

export function HomeView() {
  return (
    <div className="relative flex flex-col">
      <AsciiBackdrop className="h-85 md:h-105" />
      <LandingHero />
      <LandingLogoCta />
    </div>
  );
}
