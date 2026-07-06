'use client';

import { GitHubStarHeroCta } from '@/components/common/github-star-cta';
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

      <Container size="fluid" className="relative z-10">
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
        </div>
        <div className="relative mt-10 overflow-hidden sm:hidden" style={{ height: '420px' }}>
          <div
            style={{
              transform: 'scale(0.65)',
              transformOrigin: 'top left',
              width: `${(100 / 0.65).toFixed(4)}%`,
            }}
          >
            <HeroComponentPreview />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
            style={{
              background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)',
            }}
          />
        </div>

        <div className="relative -mx-4 mt-16 hidden px-4 sm:block md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <HeroComponentPreview />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
            style={{
              background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)',
            }}
          />
        </div>
      </Container>
    </section>
  );
}
