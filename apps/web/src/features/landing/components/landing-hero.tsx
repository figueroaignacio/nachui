'use client';

import { GitHubStarHeroCta } from '@/components/common/github-star-cta';
import { ThemeColorSwitcher } from '@/features/theme/components/theme-color-switcher';
import { Link } from '@/i18n/navigation';
import { ArrowRight02Icon, SourceCodeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { Container } from '@repo/ui/layout/container';
import { Flex } from '@repo/ui/layout/flex';
import { Stack } from '@repo/ui/layout/stack';
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
    <Stack align="center" className="bg-background relative min-h-svh overflow-hidden pt-24 pb-16">
      <section>
        <Container size="fluid">
          <Stack align="center" justify="center" gap="3" className="relative z-10">
            <GitHubStarHeroCta />
            <div className="space-y-4 text-center">
              <Typography
                variant="h1"
                className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl"
              >
                {t('subheading1')}
              </Typography>
              <Typography
                variant="h1"
                className="text-muted-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl"
              >
                {t('subheading2')}
              </Typography>
            </div>
            <p className="text-muted-foreground mx-auto max-w-2xl text-center text-lg md:text-xl">
              {t('description')}
            </p>
            <div>
              <Flex align="center" gap="4" className="pt-4">
                <Button
                  size="sm"
                  rightIcon={<HugeiconsIcon icon={ArrowRight02Icon} size={18} />}
                  asChild
                >
                  <Link href="/docs">{actions[0]?.label || 'Get started'}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<HugeiconsIcon icon={SourceCodeIcon} size={18} />}
                  asChild
                >
                  <Link href="/docs/components">{actions[1]?.label || 'View components'}</Link>
                </Button>
              </Flex>
            </div>

            <div>
              <Flex direction="column" align="center" gap="6" className="mt-8 sm:flex-row">
                <Flex
                  align="center"
                  gap="2"
                  className="border-border/50 bg-muted/30 hover:bg-muted/50 rounded-full border px-4 py-2 shadow-sm backdrop-blur-sm transition-all"
                >
                  <span className="text-muted-foreground mr-1 text-sm font-medium">Theme</span>
                  <ThemeColorSwitcher />
                </Flex>
              </Flex>
            </div>
            <div className="relative w-full">
              <HeroComponentPreview />
            </div>
          </Stack>
        </Container>
      </section>
    </Stack>
  );
}
