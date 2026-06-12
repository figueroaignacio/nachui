'use client';

import { GitHubStarHeroCta } from '@/components/common/github-star-cta';
import { ThemeColorSwitcher } from '@/features/theme/components/theme-color-switcher';
import { Link } from '@/i18n/navigation';
import { ArrowRight02Icon, SourceCodeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { Container } from '@repo/ui/layout/container';
import { useTranslations } from 'next-intl';
import { HeroComponentPreview } from './hero-component-preview';

interface HomePageActions {
  href: string;
  label: string;
  description: string;
  variant?: 'default' | 'secondary';
}

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HomePageActions[] = t.raw('actions');

  return (
    <section className="bg-background relative overflow-hidden pt-20 pb-0 sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklch, var(--border) 70%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 0%, transparent 10%, var(--background) 100%)',
        }}
      />

      <Container size="xl" className="relative z-10">
        <div className="flex flex-col items-center gap-6 px-4 text-center">
          <GitHubStarHeroCta />
          <h1 className="text-foreground text-4xl leading-none font-bold tracking-tight lg:text-6xl">
            {t('subheading1')}
          </h1>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed sm:max-w-sm sm:text-base">
            {t('description')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="sm"
              rightIcon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} />}
              asChild
            >
              <Link href="/docs">{actions[0]?.label ?? 'Get started'}</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HugeiconsIcon icon={SourceCodeIcon} size={16} />}
              asChild
            >
              <Link href="/docs/components">{actions[1]?.label ?? 'View components'}</Link>
            </Button>
          </div>

          {/* Theme switcher pill */}
          <div className="border-border/50 bg-muted/30 flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="text-muted-foreground mr-1 text-sm font-medium">Theme</span>
            <ThemeColorSwitcher />
          </div>
        </div>

        {/* ── Component preview grid ── */}
        <div className="relative mt-12 sm:mt-16">
          <HeroComponentPreview />
          {/* Bottom fade into next section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-40 sm:h-64"
            style={{
              background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)',
            }}
          />
        </div>
      </Container>
    </section>
  );
}
