import { BlurBackdrop } from '@/components/common/blur-backdrop';
import { LandingHero } from '@/features/landing/components/landing-hero';
import { LandingLogoCta } from '@/features/landing/components/landing-logo-cta';

export function HomeView() {
  return (
    <div className="relative flex flex-col">
      <BlurBackdrop className="h-[520px]" />
      <LandingHero />
      <LandingLogoCta />
    </div>
  );
}
