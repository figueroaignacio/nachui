import { GitHubStarHeroCta } from '@/components/common/github-star-cta';
import { Link } from '@/i18n/navigation';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { Container } from '@repo/ui/layout/container';
import { useTranslations } from 'next-intl';
import { BRICK_CATEGORIES } from '../lib/bricks-registry';

interface BricksHeroProps {
  activeSlug?: string;
}

interface BricksHeroActions {
  label: string;
  href: string;
  variant: 'default' | 'secondary';
}

export function BricksHero({ activeSlug }: BricksHeroProps) {
  const t = useTranslations('sections.bricks');
  const actions: BricksHeroActions[] = t.raw('actions');

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
          <h1 className="text-foreground text-6xl leading-none font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed sm:max-w-sm sm:text-base">
            {t('description')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="sm"
                rightIcon={<HugeiconsIcon icon={ArrowRight02Icon} size={14} />}
                asChild
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        <nav aria-label="Brick categories" className="border-border/50 mt-14 border-b pb-0">
          <div className="flex items-center justify-between px-4 sm:px-0">
            <div className="hide-scrollbar flex items-center gap-1 overflow-x-auto">
              {BRICK_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/bricks/${category.slug}`}
                  aria-current={activeSlug === category.slug ? 'page' : undefined}
                  className={
                    activeSlug === category.slug
                      ? 'border-foreground text-foreground border-b-2 px-3 pb-3 text-sm font-semibold whitespace-nowrap'
                      : 'text-muted-foreground hover:text-foreground px-3 pb-3 text-sm whitespace-nowrap transition-colors'
                  }
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <Link
              href="/bricks/login"
              className="text-muted-foreground hover:text-foreground hidden pb-3 text-sm whitespace-nowrap transition-colors sm:block"
            >
              Browse all →
            </Link>
          </div>
        </nav>
      </Container>
    </section>
  );
}
